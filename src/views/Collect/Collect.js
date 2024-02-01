import React, {useEffect} from "react";
import {Button, Form, Layout, Table, DatePicker, Select} from "antd";
import "./collect.css";
import {fetchCollectSearch, fetchSensorList} from "../../libs/request/sensor";
import {useMount, useSafeState} from "ahooks";
import {useForm} from "antd/es/form/Form";
import {fetchGroupList} from "../../libs/request/group";
import {fetchDeviceList} from "../../libs/request/device";
import {fetchSensorType} from "../../libs/request/sensor";
import {DeviceSelector} from "../../components/DeviceSelector/DeviceSelector";
import {GroupsSelector} from "../../components/GroupsSelector/GroupsSelector";

import dayJs from "dayjs";
import dayjs from "dayjs";


const {Content} = Layout;

// eslint-disable-next-line no-unused-vars,require-jsdoc
function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const vars = query.split("&");
  for (let i=0; i<vars.length; i++) {
    const pair = vars[i].split("=");
    if (pair[0] === variable) {return pair[1];}
  }
}
const formStyle = {
  maxWidth: "none",
  padding: 30
};
const format = "YYYY-MM-DD";
const today = dayjs();
const todayBefore30 = dayjs().subtract(30, "day");
export const Collect = () => {
  const [dataSource, setDataSource] = useSafeState([]);
  const [currentPage, setCurrentPage] = useSafeState(1);
  const size = 10;
  const [total, setTotal] = useSafeState(0);
  const [loading, setLoading] = useSafeState(false);
  const [form] = useForm();
  const [deviceList, setDeviceList] = useSafeState([]);
  const [groupList, setGroupList] = useSafeState([]);
  const [sensorList, setSensorList] = useSafeState([]);
  const [sensorType, setSensorType] = useSafeState([]);
  const [sensorId, setSensorId] = useSafeState(undefined);
  useEffect(()=>{
    fetchGroupList().then((res)=>{
      setGroupList(res);
    });
    fetchDeviceList().then((res)=>{
      setDeviceList(res);
    });
    fetchSensorType().then((res)=>{
      setSensorType(res);
    });
    fetchSensorList().then((res)=>{
      setSensorList(res);
    });
  }, []);

  const columns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      render: (_, _1, i) => <span key={i}>{i + 1}</span>,
      align: "center"
    },
    {
      title: "创建日期",
      dataIndex: "createTime",
      key: "createTime",
      render: (text, _, i) => <span key={i}>{text}</span>,
      align: "center"
    },
    {
      title: "点位",
      dataIndex: "deviceGroupId",
      key: "deviceGroupId",
      align: "center",
      maxWidth: 220,
      render: (text, _, i) => <span key = {i}>{groupList.find((item)=> item.id === text)?.name}</span>
    },
    {
      title: "设备",
      dataIndex: "deviceManageId",
      key: "deviceManageId",
      align: "center",
      render: (text, _, i) => <span key = {i} className={"base-color-device"}>{deviceList.find((item)=> item.id === text)?.name}</span>
    },
    {
      title: "传感器名称",
      dataIndex: "sensorManageId",
      key: "sensorManageId",
      align: "center",
      render: (text)=> <span key = {text} className={"base-color-exc"}>{sensorList.find((item)=> item.id === text)?.name}</span>
    },
    {
      title: "传感器类型",
      dataIndex: "sensorType",
      key: "sensorType",
      align: "center",
      render: (text, _, i) => <span key = {i} className={"base-color-sensor"}>{sensorType.find((item)=> item.sensorType === text)?.webView}</span>
    },
    {
      title: "上报数值",
      dataIndex: "analysisValue",
      key: "analysisValue",
      align: "center"
    },

    // {
    //     title: "设备当前状态",
    //     dataIndex: "sensorType",
    //     key: "sensorType",
    //     align: 'center',
    //     render(){
    //         const random = Math.floor(Math.random()*10) %3 === 0;
    //         return <Tag bordered={false} color={random? "warning":"success"}>{random? "离线":"在线"}</Tag>
    //     }
    // },
    // {
    //     title: "报警原因",
    //     dataIndex: "sensorNumber",
    //     key: "sensorNumber",
    //     align: 'center',
    //     render(){
    //         const random = Math.floor(Math.random()*3);
    //         const texts = ["流量长时间超过阈值","长时间接收不到设备的信号","水质变化超过阈值"];
    //         return <span>{texts[random]}</span>
    //     }
    // },
    {
      title: "单位",
      dataIndex: "unit",
      key: "unit",
      align: "center"
    }
  ];

  const fetchData = function(currentPage, size) {
    setLoading(true);
    const {deviceGroupId, deviceManageId, date} = form.getFieldsValue();
    fetchCollectSearch({
      deviceGroupId,
      deviceManageId,
      start: dayJs(date?.[0]).format(format),
      end: dayJs(date?.[1]).format(format),
      currentPage,
      size,
      sensorManageId: sensorId
    }).then((res) => {
      setDataSource((res?.records || []).map((it) => {
        return {
          ...it,
          online: it.online || "--"
        };
      }));
      setTotal(res?.total);
    }).finally(() => {
      setLoading(false);
    });
  };
  const autoFetchData = function() {
    const {deviceGroupId, deviceManageId, date} = form.getFieldsValue();
    fetchCollectSearch({
      deviceGroupId,
      deviceManageId,
      start: dayJs(date[0]).format(format),
      end: dayJs(date[1]).format(format),
      currentPage,
      size,
      sensorManageId: sensorId
    }).then((res) => {
      setDataSource((res?.records || []).map((it) => {
        return {
          ...it,
          online: it.online || "--"
        };
      }));
      setTotal(res?.total);
    }).finally(() => {
      setLoading(false);
    });
  };
  useEffect(()=>{
    if (sensorId) {
      fetchData(currentPage, size);
    }
  }, [sensorId]);
  useMount(() => {
    if (!getQueryVariable("sensorId")) {
      fetchData(currentPage, size);
    } else {
      setSensorId(getQueryVariable("sensorId"));
    }
  });

  const onPageChange = function(i) {
    setCurrentPage(i);

    fetchData(i, size);
  };
  const onRest = function() {
    form.resetFields();
    setSensorId(undefined);
    onPageChange(1);
  };
  return <Layout style={{height: "100%"}}>
    <div className="base-theme-bg"
      style={{background: "var(--background-color)"}}>
      <Form
        style={formStyle}
        labelAlign={"left"}
        form={form}
        name = "oi_plo"
        layout={"inline"}>

        <Form.Item label={"点位"}
          name={"deviceGroupId"}>
          <GroupsSelector />
        </Form.Item>
        <Form.Item label={"设备"} name={"deviceManageId"} >
          <DeviceSelector groupId={null} />
        </Form.Item>
        <Form.Item label={"日期"} name={"date"} initialValue={[todayBefore30, today]}>
          <DatePicker.RangePicker format={format} style={{width: 240}} />
        </Form.Item>
        <Form.Item>
          <Button onClick={autoFetchData} size={"small"} type="primary">确定</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onRest} size={"small"} type={"primary"} ghost>重置</Button>
        </Form.Item>
      </Form>
    </div>
    <Content style={{height: "100%"}}>
      <div className="table-content base-scroll-bar">
        <Table bordered
          columns={columns}
          dataSource={dataSource}
          loading={loading}
          rowKey={Math.random().toFixed(10)}
          pagination={{
            position: ["bottomCenter"],
            onChange: onPageChange,
            total: total,
            defaultPageSize: size,
            defaultCurrent: currentPage,
            current: currentPage
          }}
        />
      </div>
    </Content>
  </Layout>;
};
