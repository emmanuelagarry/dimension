import { message } from "antd";
import { FormEvent, useRef, useState } from "react";
import { Spin } from "antd";
import { customFetch } from "./utils";
import { SignalResult } from "./models";
const Tab1 = ({
  tenantId,
  tenantKey,
  pointId,
  success,
}: {
  tenantId: string;
  tenantKey: string;
  pointId: string;
  success?: (value: SignalResult) => void;
}) => {
  const [loading, setLoading] = useState(false);

  const birdRef = useRef<HTMLInputElement>(null);

  /**
   *
   * @param num  number of birds to be sent as a signal
   * @returns void
   */
  const sendBird = async (num: string) => {
    if (loading) {
      return;
    }
    try {
      setLoading(true);
      /**
       * call fetch api
       */
      const result = await customFetch(
        {
          query: /*graphql*/ `
          mutation CREATE_SIGNAL($num: String!, $pointId: ID!, $timestamp: Timestamp!){
              signal {
                create(input: {
                  pointId: $pointId
                  signals: [
                    {
                      value: $num
                      type: "bird count"
                      timestamp: $timestamp
                    }
                  ]
                }) {
                  id
                  pointId
                  type
                  data {
                    numericValue
                    rawValue
                  }
                }
              }
            }
                   
            `,
          variables: {
            num,
            pointId,
            timestamp: new Date().toISOString(),
          },
        },
        tenantId,
        tenantKey
      );

      const data = (await result.json()) as SignalResult;

      /**
       * Call optional parent function if data was successul
       */
      success?.(data);
      message.success("Signal has been sent");
    } catch (error) {
      console.log(error);
      message.success("there was an error please try again later");
    } finally {
      setLoading(false);
    }
  };

  const formSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (birdRef.current?.value) {
      sendBird(birdRef.current.value);
    } else {
      alert("Please enter a signal value");
    }
  };

  return (
    <div style={{ display: "grid", placeItems: "center" }}>
      <form onSubmit={formSubmit}>
        <label>
          Birds
          <input type="number" name="bird" ref={birdRef} />
        </label>
        &nbsp;
        <input type="submit" value="Submit" />
      </form>

      {loading ? <Spin></Spin> : <></>}
    </div>
  );
};

export default Tab1;
