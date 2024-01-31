import React, {useRef} from "react";
import {IconFont} from "./IconFont";
import {useClickAway, useDebounceEffect, useSafeState, useSetState} from "ahooks";
import {CloseOutlined} from "@ant-design/icons";
import Style from "./icon.module.css";
import {SensorInfo} from "../SensorInfo/SensorInfo";
import {Modal} from "antd";

export const dataSource = [
  {
    label: "设备状态",
    value: "icon-shengfenzuobiao_mianxing"
  },
  {
    label: "设备gis",
    value: "icon-icon_shebeiguanli"
  },
  {
    label: "资产设备",
    value: "icon-shebei_full"
  },
  {
    label: "变电设备",
    value: "icon-morenshebei"
  },
  {
    label: "工程设备",
    value: "icon-shebeiguanli3"
  },
  {
    label: "设备监控",
    value: "icon-shebei7"
  },
  {
    label: "设备1",
    value: "icon-shebei1"
  },
  {
    label: "设备组",
    value: "icon-wangluoshebei"
  },
  {
    label: "排水管道",
    value: "icon-weibiaoti1"
  },
  {
    label: "设备3",
    value: "icon-cunchushebei"
  },
  {
    label: "设备5",
    value: "icon-dianchi"
  },
  {
    label: "Iot物联",
    value: "icon-IOTwulian1"
  }
];
const MyStyle={
  fontSize: 40,
  margin: 10,
  fontWeight: "bold"
};
const FONT_SIZE = 26;
export const DeviceIcon = function(props) {
  const [list] = useSafeState(dataSource);
  const [active, setActive] = useSafeState(props.value || dataSource[0].value);
  const onClick = function(evt) {
    props.onClick && props.onClick(evt);
    setActive(evt.value);
  };
  return <div className = {Style.deviceIconWrapper}>
    {
      list.map((it)=>{
        return <span key={it.value} style={{border: `1px solid ${active===it.value? "#167":"transparent"}`}} onClick={onClick.bind(this, it)}><IconFont type={it.value} style={MyStyle} className={"base-font-color base-color-clickable"} /></span>;
      })
    }
  </div>;
};

export const DeviceIconSingle = function(props) {
  const [icon, setIcon] = useSetState({});
  useDebounceEffect(()=>{
    if (props && props.dataSource) {
      try {
        const {icon, offsetX, offsetY} = props.dataSource;
        if (isNaN(offsetX) || isNaN(offsetY)) return undefined;
        setIcon({icon, offsetX: offsetX - FONT_SIZE/2, offsetY: offsetY - FONT_SIZE/2});
      } catch (e) {
        console.log(e);
      }
    }
  }, [props.dataSource], {wait: 100});
  return (<React.Fragment><IconFont type={icon.icon}
    style={{fontSize: FONT_SIZE, left: icon.offsetX, top: icon.offsetY}}
    className={Style.deviceIconSingle} /></React.Fragment>);
};
const DeviceContent = function(props) {
  return <div className={Style.DeviceIconWrapperContent}>
    {props.closeIcon !== false && <CloseOutlined className={Style.deviceIconWrapperCloseIcon} onClick={props.onHide} />}
    <SensorInfo deviceId={props.deviceId} showPosition={false} />
  </div>;
};

export const DeviceIconContent = function(props) {
  const [show, setShow] = useSafeState(false);
  const ref = useRef(null);
  const ref2 = useRef(null);
  const onShow = function() {
    !props.hideBox && setShow(true);
  };
  const onHide = function() {
    setShow(false);
    return false;
  };
  useClickAway(onHide, [ref, ref2]);
  return (<div>
    <span onClick={onShow} ref={ref2}>
      {props.children}
    </span>
    <Modal width={960} destroyOnClose onCancel={onHide} open={show} footer={false}>
      <DeviceContent closeIcon={false} deviceId={props.deviceId} />
    </Modal>
  </div>);
};
