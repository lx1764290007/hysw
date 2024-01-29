import {Button, Checkbox, Col, Divider, Empty, Row, Select, Space, Spin} from "antd";
import React, {useEffect, useState} from "react";
import {Cell} from "../Cell/Cell";
import {LaptopOutlined} from "@ant-design/icons";
import "./monitoring-center-manage.css";
import {fetchDeviceList,fetchDeviceUpdateGroup} from "../../libs/request/device";
import SpinFC from "antd/es/spin";
import subpub from "vc-subscribe-publish";

//const group = ["点位1", "点位2", "点位3", "点位4", "点位5", "点位6", "点位7", "点位8", "点位9", "点位10", "点位13", "点位14", "点位51", "点位16", "点位17", "点位28", "点位19"];
const plainOptions = ["测试设备1", "测试设备2", "测试设备3", "测试设备4", "测试设备5", "测试设备6"];
const defaultCheckedList = [];

export const MonitoringCenterGroupManage = (props) => {

    const [active, setActive] = useState(0);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [deviceList, setDeviceList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectValue, setSelectValue] = useState(null);
    useEffect(() => {
        if (active > -1) {
            setLoading(true);
            fetchDeviceList({
                deviceGroupId: props.groups[active]?.id
            }).then((r) => {
                setDeviceList(r);
            }).finally(()=>{
                setLoading(false)
            })
        }
    }, [active])

    const checkAll = deviceList.length === checkedList.length && checkedList.length > 0;
    const indeterminate = checkedList.length > 0 && checkedList.length < deviceList.length;
    const onChange = (list) => {
        setCheckedList(list);

    };
    const onCheckAllChange = (e) => {
        setCheckedList(e.target.checked ? deviceList.map(item=> item.id) : []);
    };
    const handleMoveTo = (e) => {
        setSelectValue(e);
    };
    const handleConfirm = async (e)=>{
        if(selectValue && checkedList.length>0){
            await fetchDeviceUpdateGroup({
                deviceGroupId: selectValue,
                deviceManageIds: checkedList
            })
            subpub.public("deviceGroupShouldRefresh", true);
            onClearDeviceList();
        }
    }
    const onClearDeviceList = function (){
        const devices = deviceList.filter(it=> !checkedList.includes(it.id));
        setDeviceList(devices);
        setCheckedList([]);
    }
    const onMenuClick = function (i){
        setActive(i);
        setSelectValue(null);
        setCheckedList([]);
    }
    return (
        <div className="monitoring-center-group-manage-wrapper">

            <Row wrap gutter={2}>
                <Col span={7}>
                    <div className="monitoring-center-group-manage-group-list base-scroll-bar">
                        {
                            props.groups?.map(((item, i) => {
                                return <div key={i} onClick={()=> onMenuClick(i)}>
                                    <Cell left={<span className="base-item-title">{item.name}</span>}
                                          icon={<LaptopOutlined/>} active={Object.is(active, i)}/>
                                </div>;
                            }))
                        }
                    </div>
                </Col>
                <Col span={17}>
                    <div className="monitoring-center-group-manage-group-list base-scroll-bar "
                         style={{border: "none"}}>
                        <Space wrap style={{width: "100%", display: "flex", justifyContent: "space-between"}}
                               align={"center"}>
                            <Checkbox indeterminate={indeterminate} style={{marginLeft: 10}} onChange={onCheckAllChange}
                                      checked={checkAll}>
                                全选
                            </Checkbox>
                            <span style={{position: "relative"}}>
                                移动到：
                <Select
                    style={{
                        width: 120
                    }}
                    placeholder={"选择点位"}
                    onChange={handleMoveTo}
                    value = {
                        selectValue
                    }
                    options={props.groups?.map?.((item) => ({
                        label: item.name,
                        value: item.id,
                        disabled: item.id === props.groups[active]?.id
                    })) }
                />
              </span>
                        </Space>
                        <Divider/>
                        {deviceList.length > 0 && <Checkbox.Group value={checkedList} onChange={onChange}>
                            {
                                deviceList.map(((it, i) => {
                                    return <div key={i}
                                                className="monitoring-center-group-manage-items">
                                        <Checkbox value={it.id}>{it.name}</Checkbox>
                                    </div>;
                                }))
                            }

                        </Checkbox.Group>
                        }
                        {
                            deviceList.length < 1 && <div style={{position: 'relative'}}><Empty /></div>
                        }
                        {
                            loading && <div style={{display: 'flex',top: 0, width: '100%',position:'absolute',justifyContent:'space-around',height:'100%',alignItems:'center'}}><SpinFC size={"large"} /></div>
                        }
                    </div>
                    <div className={"monitoring-center-group-manage-confirm-btn"}>
                        <Button type={"primary"} onClick={handleConfirm}>
                            确认
                        </Button>
                    </div>
                </Col>
            </Row>

        </div>
    );
};
