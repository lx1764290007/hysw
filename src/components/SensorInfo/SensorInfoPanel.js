import {Box} from "../Box/Box";
import React, {useEffect} from "react";
import {IconFont} from "../Icon/IconFont";
import {MyMap} from "../BigSurMap/MyMap";
import {Button, Modal} from "antd";
import {useSafeState, useSetState} from "ahooks";

const SensorInfoPanel = (prop) => {
  const [show, setShow] = useSafeState(false);
  const [position, setPosition] = useSetState({});
  const onShow = function() {
    setShow(true);
  };
  const onHide = function() {
    setShow(false);
  };
  useEffect(()=>{
    prop.dataSource && setPosition({
      offsetY: Number(prop.dataSource.latitude),
      offsetX: Number(prop.dataSource.longitude),
      icon: prop.dataSource.iconData
    });
  }, [prop.dataSource]);
  return <div className="sensor-info-panel-container">
    <Box withoutBackground>
      <div className="sensor-info-panel-header">
        <IconFont type={prop.dataSource?.iconData} className="sensor-info-panel-header-icon"/>
        <div className="sensor-info-panel-header-desc">
          <span>{prop.dataSource?.name}</span>
          <span>{prop.dataSource?.deviceNumber}</span>
        </div>
      </div>
      <div className="sensor-info-panel-content base-scroll-bar">
        <div className="sensor-info-panel-content-item">
          <span>状态 </span>
          <span
            className={prop.dataSource?.state ? "base-color-sensor" : "base-color-error"}>{prop.dataSource?.state ? "在线" : "离线"}</span>
        </div>
        <div className="sensor-info-panel-content-item">
          <span>当前电压 </span>
          <span>{Number(prop.dataSource?.currentVoltage)*100 + " %"}</span>
        </div>
        {/* <div className="sensor-info-panel-content-item">*/}
        {/*  <span>没电电压</span>*/}
        {/*  <span>{prop.dataSource?.deficitVoltage}</span>*/}
        {/* </div>*/}
        {/* <div className="sensor-info-panel-content-item">*/}
        {/*  <span>满电电压 </span>*/}
        {/*  <span>{prop.dataSource?.fullyVoltage}</span>*/}
        {/* </div>*/}
        <div className="sensor-info-panel-content-item">
          <span>掉线延迟 </span>
          <span>{prop.dataSource?.offlineDelay}</span>
        </div>
        <div className="sensor-info-panel-content-item">
          <span>心跳时间 </span>
          <span>{prop.dataSource?.online}</span>
        </div>
        {prop.showPosition !== false && <div className="sensor-info-panel-content-item">
          <span>安装位置 </span>
          <Button size={"small"} onClick={onShow} type={"text"}>查看</Button>
        </div> }
      </div>
    </Box>
    <Modal title={"安装位置"}
      width={700}
      closeIcon
      style={{
        top: 30
      }}
      open={show}
      onCancel={onHide}
      footer={false}>
      <MyMap
        single
        icon={prop.dataSource?.iconData}
        disabled
        readOnly
        position={[position]}/>
    </Modal>
  </div>;
};


export default SensorInfoPanel;
