import { Spin } from "antd";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { LastTenModel } from "./lastten.model";
import { customFetch } from "./utils";

const Tab2 = ({
  tenantId,
  tenantKey,
  signalData$,
}: {
  tenantId: string;
  tenantKey: string;
  signalData$: any;
}) => {
  const [signalData, setSignalData] = useState<{ num: number }[]>([]);

  const [loading, setLoading] = useState(false);

  /**
   * Get last ten signals
   */
  const getLastTen = async () => {
    setLoading(true);
    try {
      /** call fetch api */
      const result = await customFetch(
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
            }`,
        },
        tenantId,
        tenantKey
      );
      const data = (await result.json()) as LastTenModel;
      const num = data.data.signals.edges.map((item) => ({
        num: item.node.data.numericValue,
      }));

      /** Listen to changes in reactive object */
      signalData$.subscribe((val: any) => {
        /* Update state */
        setSignalData(val);
      });

      // update state after calling signals
      signalData$.next(num);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getLastTen();
  }, []);

  return (
    <>
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

      {loading ? <Spin></Spin> : <></>}
    </>
  );
};
export default Tab2;

