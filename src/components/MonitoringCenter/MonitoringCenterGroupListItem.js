import React, {useEffect} from "react";
import {Collapse, Empty} from "antd";
import {Cell} from "../Cell/Cell";
import {fetchDeviceList} from "../../libs/request/device";
import {useMount, useSafeState} from "ahooks";
import {LaptopOutlined} from "@ant-design/icons";
import subpub from "vc-subscribe-publish";

const {Panel} = Collapse;

const getAsyncData = async function(deviceState) {
  return await fetchDeviceList({
    state: deviceState
  });
};

export function MonitoringCenterGroupListItem(props) {
  const [dataList, setDataList] = useSafeState([]);
  const [activeKey, setActiveKey] = useSafeState("0");
  const fetchData = function() {
    getAsyncData(props.deviceState).then((res)=>{
      setDataList(res);
    });
  };
  useMount(() => {
    fetchData();
    subpub.subscribe("deviceShouldRefresh", fetchData);
  });
  useEffect(()=>{
    onChange([activeKey]);
  }, [dataList]);
  useEffect(()=>{
    if (props.dataSource?.length > 0 && !props.activeKey ) {
      onChange(activeKey[0] || "0");
    } else {
      onChange(props.activeKey );
    }
  }, [props.dataSource]);
  const onChange = function(value) {
    setActiveKey(value);
    const group = props.dataSource[Number(value[0]||"0")];
    const groupDeviceList = dataList.filter((item)=>{
      return item.deviceGroupId === group?.id;
    });
    if (value && value[0]) {
      props.onChange?.(group, groupDeviceList);
    } else {
      props.onChange?.({}, groupDeviceList);
    }

  };
  return (
    <>
      {props?.dataSource?.length > 0 &&
                <Collapse ghost accordion onChange={onChange} activeKey={activeKey} className="base-scroll-bar">
                  {

                    props?.dataSource?.map((item, index) => {
                      return (
                        <Panel key={index} header={item?.name}>
                          {
                            dataList?.map((k, k_)=>{
                              return (
                                k?.deviceGroupId === item.id && <Cell left={k["name"]} right={k["deviceNumber"]} key={k_}
                                  icon={<LaptopOutlined />}> </Cell>
                              );
                            })
                          }
                          {dataList?.some((it)=> it?.deviceGroupId === item.id) === false && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
                          {/* <Cell left="这是测试" right="这是测试二"*/}
                          {/*      icon={<IconFont type="icon-yingjian1"/>}> </Cell>*/}
                          {/* <Cell left="这是测试" right="这是测试二"*/}
                          {/*      icon={<IconFont type="icon-yingjian1"/>}> </Cell>*/}
                          {/* <Cell left="这是测试" right="这是测试二" icon={<IconFont type="icon-yingjian1"/>}*/}
                          {/*      footer="测试footer"> </Cell>*/}
                          {/* <Cell left="这是测试" right="这是测试二" icon={<IconFont type="icon-yingjian1"/>}*/}
                          {/*      footer="测试footer"> </Cell>*/}
                        </Panel>
                      );
                    })
                  }
                </Collapse>
      }
      {
        props?.dataSource?.length < 1 && <Empty style={{marginTop: 50}} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      }
    </>
  );
}
