import React, {useEffect} from "react";
import {Button, Layout, Modal, Space, Spin} from "antd";
import "./monitoring-list.css";
import {MonitoringCenterGroupListItem} from "./MonitoringCenterGroupListItem";
import {MonitoringCenterStatistic} from "./MonitoringCenterStatistic";

import {IconFont} from "../Icon/IconFont";
import {MonitoringCenterGroupManage} from "./MonitoringCenterGroupManage";
import {useMount, useSafeState, useToggle} from "ahooks";
import {DeviceGroupAdd} from "./components/DeviceGroupAdd";
import {fetchGroupList} from "../../libs/request/group";
import {fetchDeviceList} from "../../libs/request/device";
import pubSub from "vc-subscribe-publish";
import {PlusOutlined} from "@ant-design/icons";
import {storeRole} from "../../libs/lib";
import {useHookstate} from "@hookstate/core";
const {Content, Footer} = Layout;

// eslint-disable-next-line require-jsdoc
function MonitoringCenterDeviceGroupManageModal(props) {

  return (
    <MonitoringCenterGroupManage groups={props.group} />
  );
}


// eslint-disable-next-line require-jsdoc
export function MonitoringCenterDeviceGroup(prop) {
  const [searchState] = React.useState(true);
  const [opened, {setLeft, setRight}] = useToggle(false);
  const [deviceGroupShow, setDeviceGroupShow] = useSafeState(false);
  const [groupList, setGroupList] = useSafeState([]);
  const [loading, setLoading] = useSafeState(false);
  const [fullGroups, setFullGroups] = useSafeState([]);
  const [activeKey, setActiveKey] = useSafeState(0);
  const [deviceState, setDeviceState] = useSafeState(undefined);
  const _role = useHookstate(storeRole);

  useEffect(()=>{
    getGroupList( ).catch((e)=>{
      console.log(e);
    });

  }, []);
  // eslint-disable-next-line require-jsdoc
  async function getGroupList() {
    setLoading(true);
    const g = await fetchGroupList();
    setGroupList(g);
    setFullGroups(g);
    setLoading(false);
  }

  useEffect(()=>{
    prop.onGroupListChange?.(groupList);

  }, [groupList]);

  useMount(()=>{
    pubSub.subscribe("deviceGroupShouldRefresh", function([_1, _2, id=null]) {

      getGroupList().then((res)=>{
        if (id) {
          setActiveKey(String(groupList.findIndex((it)=> it.id === id)));
        }
      }).catch((e)=>{
        console.log(e);
      });
    });
  });
  const onMenuChange = async function(event) {
    let state;
    if (event === "online") {
      state = true;
    } else if (event === "offline") {
      state = false;
    } else {
      state = undefined;
    }
    setDeviceState(state);
    setLoading(true);
    const res = await fetchDeviceList({
      state
    });
    if (res && res.length>0 ) {
      fetchGroupList({
        ids: Array.from(new Set(res.map?.((it) => {
          return it.deviceGroupId;
        }))).join?.(",")
      }).then((groups) => {
        setGroupList(groups);
      }).finally(() => {
        setLoading(false);
      });
    } else {
      setGroupList([]);
      setLoading(false);
    }
  };
  const onDeviceGroupClose = function(refresh) {

    if (refresh) {
      getGroupList().catch((e)=>{
        setGroupList(e);
      });
    }
    setDeviceGroupShow(false);
  };
  const onDataChange = function(group, deviceList) {
    if (deviceState === undefined) {
      prop.onChange?.(group, deviceList);
    } else {
      prop.onChange?.(group, deviceList.filter((item)=> item.state === deviceState));
    }
  };
  return (
    <React.Fragment>
      <Layout className="device-list-wrapper">
        {/* <Header style={{height: 40, padding: 0, backgroundColor: 'transparent'}}*/}
        {/*        className="device-ant-layout-header">*/}
        {/*    {searchState && <Search onFocus={() => setSearchState(false)}*/}
        {/*                            placeholder="输入设备号、设备名称"*/}
        {/*    />}*/}
        {/*    {*/}
        {/*        !searchState && <Space.Compact*/}
        {/*            style={{*/}
        {/*                width: '100%',*/}
        {/*                padding: 0,*/}
        {/*                margin: 0*/}
        {/*            }}*/}
        {/*        >*/}
        {/*            <Input placeholder="输入设备号、设备名称"/>*/}
        {/*            <Button type="default" onClick={() => setSearchState(true)}>取消</Button>*/}
        {/*        </Space.Compact>*/}
        {/*    }*/}
        {/* </Header>*/}
        {searchState && <MonitoringCenterStatistic onChange={onMenuChange} />}
        <Content className="device-list-content base-scroll-bar">
          {loading && <div style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "space-around"}}>

            <Spin size={
              "large"
            } />

          </div>}
          {searchState && !loading && <MonitoringCenterGroupListItem deviceState={deviceState} activeKey={activeKey} dataSource={groupList} onChange={(group, deviceList)=> onDataChange(group, deviceList)} />}
          {/* {!searchState && (<div>*/}
          {/*    <Cell left="这是测试" right={<span>Hello world</span>} icon={<IconFont type="icon-yingjian1"/>}*/}
          {/*          footer="测试footer"> </Cell>*/}
          {/*    <Cell left="这是测试" right="这是测试二" icon={<IconFont type="icon-yingjian1"/>}*/}
          {/*          footer="测试footer"> </Cell>*/}
          {/*    <Cell left="这是测试" right="这是测试二" icon={<IconFont type="icon-yingjian1"/>}*/}
          {/*          footer="测试footer"> </Cell>*/}
          {/*    <Cell left="这是测试" right="这是测试二" icon={<IconFont type="icon-yingjian1"/>}*/}
          {/*          footer="测试footer"> </Cell>*/}
          {/* </div>)}*/}
        </Content>
        <Footer className="device-list-footer">
          <Space direction="horizontal">
            <Button type="text" disabled={_role.get()!=="ROOT"} onClick = {setRight} className="ant-button-style" size="middle"><IconFont
              type={"icon-shebei1"} style={{marginRight: 7}} /> 设备迁移</Button>
            <div className="device-list-footer-space"></div>
            <Button type="text"disabled={_role.get()!=="ROOT"} className="ant-button-style" size="middle" onClick={()=>setDeviceGroupShow(true)} ><PlusOutlined /> 新建点位</Button>
          </Space>
        </Footer>
      </Layout>
      <Modal title="设备迁移" cancelText={"取消"} footer={false} okText={"确认"} open={opened} onCancel={setLeft} onOk={setLeft} width={"max(60vw,800px)"} style={{maxHeight: "60vh"}}>
        <MonitoringCenterDeviceGroupManageModal group={fullGroups} onClose={setLeft} />
      </Modal>
      <DeviceGroupAdd show={deviceGroupShow} onClose={onDeviceGroupClose} />
    </React.Fragment>
  );
}

