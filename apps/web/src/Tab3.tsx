import { message, Spin } from "antd";
import { FormEvent, useRef, useState } from "react";
import { LastTenModel } from "./lastten.model";
import SignalSender from "./SignalSender";

const Tab3 = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const handleError = (error: unknown) => {
    console.log(error);
    const errorMessage =
      error instanceof Error ? error.message : "There was an error";
    message.error(errorMessage);
  };

  /**
   *
   * @param event
   * @returns
   * Get token with user logon details
   */
  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    if (!email || !password) {
      alert("email or password fields are incorrect");

      return;
    }
    try {
      event.preventDefault();
      if (loading) {
        return;
      }
      setLoading(true);

      const result = await fetch("http://localhost:4200/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await result.json();
      if (result.ok) {
        setToken(data.token);
      } else {
        console.log(data);
        throw new Error(data?.message ?? result.status);
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  /* Get token without login */
  const getToken = async () => {
    try {
      const result = await fetch("http://localhost:4200/generatetoken", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await result.json();
      if (result.ok) {
        setToken(data.token);
      } else {
        console.log(data);
        throw new Error(data?.message ?? result.status);
      }
    } catch (error) {}
  };
  const onSuccess = (data: LastTenModel) => {
    console.log(data);
  };
  return (
    <>
      <div style={{ display: "grid", placeItems: "center" }}>
        <p>
          This tab uses a custom auth service. The custom auth service is a
          nodejs(express) application that uses tokens.
        </p>

        <button onClick={getToken}>Generate Token without login </button>
        <br></br>

        <form onSubmit={formSubmit}>
          <label style={{ padding: "10px" }}>
            Email
            <input type="email" name="email" ref={emailRef} />
          </label>

          <label style={{ padding: "10px" }}>
            password
            <input type="password" name="email" ref={passwordRef} />
          </label>

          <input type="submit" value="Genereate token" />
        </form>

        <br></br>
        <p>
          The button below in the application is a seperate component and has
          been set up to be built as a library in my package.json and
          vite.config.ts
        </p>
        <p>The button returns the last 10 signals</p>

        <p>Make sure the nodejs server is running in the background</p>
        <SignalSender
          token={token}
          onError={handleError}
          onSuccess={onSuccess}
        />

        <div style={{ maxWidth: "80vw" }}>
          {token ? (
            <>
              <p>New Token Generated : {token}</p>
            </>
          ) : (
            <></>
          )}
        </div>

        {loading ? <Spin></Spin> : <></>}
      </div>
    </>
  );
};

export default Tab3;
