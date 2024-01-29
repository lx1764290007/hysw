import React, {useEffect} from "react";
import {Card, Empty, Modal, Popconfirm, Tag} from "antd";
import {useSafeState} from "ahooks";
import {
  BellOutlined,
  EditOutlined,
  LineChartOutlined,
  SettingOutlined,
  AimOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import {SensorInfo} from "../../components/SensorInfo/SensorInfo";
import "./monitoring-center-content.css";
import {Cell} from "../../components/Cell/Cell";
import {LaptopOutlined, UnorderedListOutlined} from "@ant-design/icons";
import {Terminal} from "./Terminal/Terminal";
import {DeviceMange} from "../../components/MonitoringCenter/components/DeviceMange";
import {DeviceGroupUpdate} from "../../components/MonitoringCenter/components/DeviceGroupUpdate";
import {useNavigate} from "react-router-dom";
import pubSub from "vc-subscribe-publish";
import {fetchSensorList} from "../../libs/request/sensor";
import {fetchGroupRemove} from "../../libs/request/group";
import {useHookstate} from "@hookstate/core";
import {storeRole} from "../../libs/lib";

const CellRight = (prop) => {
  const [isModalOpen, setModalOpen] = useSafeState(false);
  const [isTerminalModalOpen, setTerminalModalOpen] = useSafeState(false);
  const navigate = useNavigate();
  const handleHistoryOpen = function() {
    setModalOpen(true);
  };
  const handleHistoryClose = function() {
    setModalOpen(false);
  };
  const handleTerminalModalOpen = function() {
    setTerminalModalOpen(true);
  };
  const handleTerminalModalClose = function() {
    setTerminalModalOpen(false);
  };
  const onSensorClick = function() {
    if (prop.groupId && prop.deviceId) {
      navigate("/sensor?groupId="+prop.groupId + "&deviceId=" + prop.deviceId + "&groupName=" + prop.groupName + "&deviceName=" + prop.deviceName);
    }
  };
  const toNotification = function() {
    if (prop.groupId && prop.deviceId) {
      navigate("/notification?groupId="+prop.groupId + "&deviceId=" + prop.deviceId + "&groupName=" + prop.groupName + "&deviceName=" + prop.deviceName);
    }
  };
  return <>
    <div className="monitoring-center-content-cell-right">
      <span onClick={onSensorClick}>
        <AimOutlined title={"传感器"}
          className="base-color-sensor"
          style={{fontSize: "larger"}} />
        <span style={{fontSize: "small", marginLeft: 3}}>传感器</span>
      </span>
      <span onClick={toNotification}>
        <BellOutlined className="base-color-warn"
          title={"报警记录"}
          style={{fontSize: "larger"}} />
        <span style={{fontSize: "small", marginLeft: 3}}>报警记录</span>
      </span>
      <span onClick={handleHistoryOpen}>
        <LineChartOutlined className="base-color-clickable"
          style={{fontSize: "larger"}}
          title={"详情"}/>
        <span style={{fontSize: "small", marginLeft: 3}}>详情</span>
      </span>
      {/* <SendOutlined className="base-color-exc"*/}
      {/*  style={{fontSize: "larger"}}*/}
      {/*  onClick={handleTerminalModalOpen}*/}
      {/*  title={"数据下发"}/>*/}
    </div>
    <Modal title="设备详情"
      width={800}
      open={isModalOpen}
      onOk={handleHistoryClose}
      footer={null}
      onCancel={handleHistoryClose}>
      <SensorInfo deviceId={prop.deviceId} />
    </Modal>
    <Modal title="数据下发"
      width={500}
      open={isTerminalModalOpen}
      onOk={handleTerminalModalClose}
      onCancel={handleTerminalModalClose}>
      <Terminal />
    </Modal>
  </>;
};

const CellFooter = (prop) => {

  const [list, setList] = useSafeState([]);
  useEffect(()=>{
    const data = prop.list?.filter((item)=>{
      return item.deviceManageId === prop.deviceId;
    });
    setList(data);
  }, [prop.list, prop.deviceId]);

  return <div className = "tag-wrapper base-scroll-bar">
    {
      list.map((it)=>{
        return <Tag title={"传感器"} key={it.name} color="#234567" bordered={false}>{it.name}</Tag>;
      })
    }
  </div>;
};
export const MonitoringCenterContent = (prop) => {

  const [deviceManageShow, setDeviceManageShow] =useSafeState(false);
  const [groupUpdateShow, setGroupUpdateShow] = useSafeState(false);
  const [sensorList, setSensorList] = useSafeState([]);
  const _role = useHookstate(storeRole);
  useEffect(()=>{
    fetchSensorList().then((res)=>{
      setSensorList(res);
    });
  }, []);
  const onDeviceManageClick = function(key) {
    setDeviceManageShow(true);
  };
  const onDeviceManageClose = function(param) {
    setDeviceManageShow(false);
    if (param) {
      pubSub.public("deviceShouldRefresh", true);
    }
  };
  const onUpdateFinish = function(param, id) {

    setGroupUpdateShow(false);
    param && pubSub.public("deviceGroupShouldRefresh", true, param, id);
  };
  const onUpdateGroupHandle = function() {
    setGroupUpdateShow(true);
  };
  const onRemoveGroupHandle = function() {
    fetchGroupRemove({
      id: prop.dataSource.id
    }).then(()=>{
      pubSub.public("deviceGroupShouldRefresh", true);
    });
  };
  return <div className="monitoring-center-content base-scroll-bar">

    {prop.dataSource?.id && <Card
      extra={_role.get() === "ROOT" && <div className="monitoring-center-content-list-tools">
        {/* eslint-disable-next-line max-len */}
        <span className="monitoring-center-content-list-item base-color-clickable"
          onClick={onUpdateGroupHandle}
          title="修改设备组"><EditOutlined/></span>
        <Popconfirm title={"是否要删除此分组？"} trigger={"click"} onConfirm={onRemoveGroupHandle}>
          <span className="monitoring-center-content-list-item   base-color-error"

            title="删除"><DeleteOutlined/></span>
        </Popconfirm>
        {/* eslint-disable-next-line max-len */}
        <span className="monitoring-center-content-list-item  base-color-warn"
          onClick={(i)=>onDeviceManageClick(i)}
          title="编辑设备"><SettingOutlined/></span>
      </div>} title={<span><UnorderedListOutlined style={{color: "#3388dd", marginRight: 5}}/> {prop.dataSource?.name}</span>}>

      {prop.deviceList?.map?.((item, i)=><Cell key={i} status state={item.state} left={<span className="base-item-title" style={{fontSize: "larger"}}>{item.name}</span>}
        right={<CellRight groupId={prop.dataSource.id} deviceId={item.id} groupName={prop.dataSource.name} deviceName={item.name} />}
        footer={<CellFooter deviceId={item.id} list={sensorList} name="标签1"/>}
        icon={<LaptopOutlined/>} style={{"height": 72, borderBottom: "1px solid rgba(96,203,100,.3)"}}/>)}
      {prop.deviceList?.length < 1 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} /> }
    </Card>}
    {!prop.dataSource?.id && <Empty description={"从左边选择一个点位"} image={Empty.PRESENTED_IMAGE_SIMPLE} style={{marginTop: 150}} />}
    <DeviceMange title={prop.dataSource?.name} groupId={prop.dataSource?.id} show={deviceManageShow} onClose={(param)=> onDeviceManageClose(param)} />
    <DeviceGroupUpdate show={groupUpdateShow} item={prop.dataSource} onClose={ onUpdateFinish} />
  </div>;
};
