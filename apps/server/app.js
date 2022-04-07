const express = require("express");
const axios = require("axios").default;
const cors = require("cors");
const jwt = require("jsonwebtoken");
const port = 4200;
const TENANT_ID = "emmanuel";
const TENANT_KEY = "0134fb7f082ec4af03574575";
const apiUrl = "https://iot.dimensionfour.io/graph";
const app = express();

app.use(cors());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("jello world");
});

app.get("/generatetoken", async (req, res) => {
  const token = jwt.sign({ emmanuel: "agarry" }, TENANT_KEY, {
    expiresIn: "1h",
  });

  res.send({token});
});
// params: { email: "emmanuelagarry@gmail.com", password: "H3yMJgCYzxLQeWP" }
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log({ email, password });
    const result = await axios.post(apiUrl, {
      query: `mutation LOG_IN {
        account {
          login(
            input: {
              service: PASSWORD
              params: { email: "${email}", password: "${password}" }
            }
          ) {
            id
          }
        }
      }`,
    });

    if (result.data.errors) {
      res.status(400).send({ message: "In correct credential" });
    } else {
      const token = jwt.sign({ email }, TENANT_KEY, {
        expiresIn: "1h",
      }); 
      res.send({ token });
    }
  } catch (error) {
    console.log(error);
    const message = error.message ?? "there was an error";
    res.status(500).send({ message: message });
  }
});

app.post("/getlast", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      jwt.verify(token, TENANT_KEY);
      const result = await axios.post(
        apiUrl,
        {
          query: /*graphql*/ `
      query LATEST_SIGNALS {
          signals(
            paginate: { last:10 }
          ){
            edges {
              node {
                id
                timestamp
                createdAt
                type
                unit
                pointId
                data {
                  numericValue
                  rawValue
                }
              }
            }
          }
        }, 
      `,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-tenant-id": TENANT_ID,
            "x-tenant-key": TENANT_KEY,
          },
        }
      );

      res.send(result.data);
    } else {
      res.sendStatus(401);
    }
  } catch (error) {
    const message = error.message ?? "Some error";
    res.status(500).send({ message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening  http://localhost:${port}/`);
});
