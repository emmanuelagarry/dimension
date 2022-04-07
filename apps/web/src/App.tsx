import { Tabs } from "antd";
import "./App.css";
import "antd/dist/antd.css";
const { TabPane } = Tabs;
import Tab1 from "./Tab1";
import Tab2 from "./Tab2";
import { SignalResult } from "./models";
import { Subject } from "./utils";
import Tab3 from "./Tab3";
import Tab4 from "./Tab4";

/**
 * Secrets from .env file
 */
const tenantId = import.meta.env.VITE_TENANT_ID as string;
const tenantKey = import.meta.env.VITE_TENANT_KEY as string;
const pointId = import.meta.env.VITE_POINT_ID as string;

function App() {
  /**
   * My custom reactive object
   */
  const signalData$ = Subject<{ num: number }[]>([]);

  /**
   *
   * @param result Contains data of newly created Signal
   *
   */
  const success = (result: SignalResult) => {
    const num = result.data.signal.create[0].data.numericValue;
    let currentValue = signalData$.value;

    if (currentValue.length === 10) {
      currentValue.splice(0, 1);
    }

    currentValue = [...currentValue, { num }];
    /**
     * Add new signal to reactive object
     */
    signalData$.next(currentValue);
  };
  return (
    <>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Input" key="1">
          <Tab1 {...{ tenantId, tenantKey, pointId, success }} />
        </TabPane>
        <TabPane tab="Dashboard" key="2">
          <Tab2 {...{ tenantId, tenantKey, signalData$ }} />
        </TabPane>
        <TabPane tab="Auth Example" key="3">
          <Tab3 />
        </TabPane>
        <TabPane tab="Further" key="4">
          <Tab4 />
        </TabPane>
      </Tabs>
    </>
  );
}

export default App;
