import "./sensor-info.css";
import {useSafeState} from "ahooks";
import React, {useEffect} from "react";
import SensorInfoPanel from "./SensorInfoPanel";
import {Box} from "../Box/Box";
import SensorInfoTable from "./SensorInfoTable";
import {fetchDevice} from "../../libs/request/device";

export const SensorInfo = (props) => {
  const [data, setData] = useSafeState([]);
  const asyncFetch = async () => {
    if (props.deviceId) {
      const data2 = await fetchDevice(props.deviceId);
      setData(data2);
    }
  };

  useEffect(() => {
    asyncFetch();
    //  eslint-disable-next-line
    }, []);
  return (
    <div className="sensor-info-wrapper base-scroll-bar">
      <div className="sensor-info-container">
        <div className="sensor-info-box-items">
          <div className="sensor-info-box-item" ><SensorInfoPanel showPosition={props.showPosition} dataSource={data} /></div>
          <div className="sensor-info-box-item" style={{flex: 2}}>
            <Box withoutBackground>
              <SensorInfoTable daviceManageId={data.id} />
            </Box>
          </div>
        </div>
      </div>
    </div>
  );
};
