import React from "react";
import {Layout} from "antd";
// eslint-disable-next-line max-len
import {MonitoringCenterDeviceGroup} from "../../components/MonitoringCenter/MonitoringCenterDeviceGroup";
import "./monitoring-center.css";
import {MonitoringCenterContent} from "./MonitoringCenterContent";
import {useSafeState} from "ahooks";

const {Sider, Content} = Layout;

export const MonitoringCenter = () =>{
  const [activeItem, setActiveItem] = useSafeState({});
  const [activeDevices, setActiveDevices] = useSafeState([]);
  const [groupList, setGroupList] = useSafeState([]);

  const onChange = function(group, deviceList) {
    if (group) {
      setActiveItem(group);
    }
    setActiveDevices(deviceList);
  };
  const onGroupListChange = function(list) {
    setGroupList(list);
  };

  return (<div className="device-manage-wrapper">
    <Layout style={{"height": "100%"}}>
      <Sider className="device-manage-sider">
        <MonitoringCenterDeviceGroup onChange={onChange} onGroupListChange={onGroupListChange} />
      </Sider>
      <Content className="monitoring-center-content-wrapper">
        <MonitoringCenterContent dataSource={activeItem} groupList={groupList} deviceList={activeDevices} />
      </Content>
    </Layout>
  </div>);
}
;
