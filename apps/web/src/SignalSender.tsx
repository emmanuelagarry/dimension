import { Spin } from "antd";
import { useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LastTenModel } from "./lastten.model";

const SignalSender = ({
  token,
  onError,
  onSuccess,
}: {
  token: string;
  onError?: (error: unknown) => void;
  onSuccess?: (error: any) => void;
}) => {
  const loading = useRef(false);
  const [signalData, setSignalData] = useState<{ num: number }[]>([]);
  const getSignals = async () => {
    if (token === "") {
      const newError = new Error("Token is invalid");
      onError?.(newError);
      return;
    }
    try {
      if (loading.current) {
        return;
      }

      loading.current = true;
      const result = await fetch("http://localhost:4200/getlast", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await result.json();
      if (result.ok) {
        const res = (data as LastTenModel).data.signals.edges.map((item) => ({
          num: item.node.data.numericValue,
        }));

        setSignalData(res);
        onSuccess?.(data);
      } else {
        throw new Error(data?.message ?? result.status);
      }
    } catch (error) {
      onError?.(error);
    } finally {
      loading.current = false;
    }
  };

  return (
    <>
      <button onClick={getSignals}>Get last ten signals</button>
      {signalData.length ? (
        <LineChart
          width={300}
          height={300}
          data={signalData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <Line type="monotone" dataKey="num" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis />
          <YAxis />
          <Tooltip />
        </LineChart>
      ) : (
        <></>
      )}
    </>
  );
};

export default SignalSender;
