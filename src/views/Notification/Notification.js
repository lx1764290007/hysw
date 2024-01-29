import React, {useEffect} from "react";
import {Breadcrumb, Button, Form, Layout, Table, Tag, DatePicker, Select} from "antd";
import "./notification.css";
import {fetchRecordSearch, fetchRecordUpdate} from "../../libs/request/record";
import {useDebounceEffect, useMount, useSafeState} from "ahooks";
import {useNavigate, useSearchParams} from "react-router-dom";
import {LeftOutlined, MailOutlined, WechatOutlined} from "@ant-design/icons";
import {DeviceSelector} from "../../components/DeviceSelector/DeviceSelector";
import {GroupsSelector} from "../../components/GroupsSelector/GroupsSelector";
import {useForm} from "antd/es/form/Form";
import {fetchDeviceList} from "../../libs/request/device";
import {fetchGroupList} from "../../libs/request/group";
import {fetchUserList} from "../../libs/request/user";
import {fetchSensorList, fetchSensorType} from "../../libs/request/sensor";
import dayjs from "dayjs";
import {useHookstate} from "@hookstate/core";
import {storeRole} from "../../libs/lib";


const format = "YYYY-MM-DD";
const {Content} = Layout;

const formStyle = {
  maxWidth: "none",
  padding: 30
};

export const Notification = () => {
  const [dataSource, setDataSource] = useSafeState([]);

  const [currentPage, setCurrentPage] = useSafeState(1);
  const size = 10;
  const [total, setTotal] = useSafeState(0);
  const [params] = useSearchParams();
  const [groupId, setGroupId] = useSafeState(null);
  const [deviceId, setDeviceId] = useSafeState(null);
  const [groupName, setGroupName] = useSafeState(null);
  const [deviceName, setDeviceName] = useSafeState(null);
  const [loading, setLoading] = useSafeState(false);
  const [gId, setGId] = useSafeState(null);
  const [deviceList, setDeviceList] = useSafeState([]);
  const [groupList, setGroupList] = useSafeState([]);
  const [userList, setUserList] = useSafeState([]);
  const [sensorList, setSensorList] = useSafeState([]);
  const [sensorTypeList, setSensorTypeList] = useSafeState([]);
  const [form] = useForm();
  const _role = useHookstate(storeRole);

  useEffect(()=>{
    fetchDeviceList().then((res) => {
      setDeviceList(res);
    });
    fetchGroupList().then((res)=>{
      setGroupList(res);
    });
    fetchUserList( ).then((res) => {
      setUserList(res);

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
      title: "日期和时间",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (text, _, i) => <span key={i}>{text}</span>,
      align: "center"
    },
    {
      title: "触发原因描述",
      dataIndex: "triggerRemark",
      key: "triggerRemark",
      align: "center"
    },
    {
      title: "传感器",
      dataIndex: "sensorManageId",
      key: "sensorManageId",
      align: "center",
      render: (text) => <span>{sensorList.find((it)=> it.id === text)?.name}</span>
    },
    {
      title: "传感器类型",
      dataIndex: "sensorManageId",
      key: "sensorManageId_",
      align: "center",
      render: (text) => <span className = "base-color-sensor">{sensorTypeList.find((it)=> it.sensorType === sensorList.find((it)=> it.id === text)?.sensorType)?.webView}</span>
    },
    {
      title: "联系人",
      dataIndex: "noticeSettings",
      key: "noticeSettings",
      align: "center",
      maxWidth: 220,
      render: (_1, _2, i) => {
        return (<div key={i}>

          <span>{_1?.map?.((it, _i)=>{
            // eslint-disable-next-line react/jsx-key
            return <div className="table-wrapper" key={_i}>
              <span className="table-icon">{it.noticeData?.email && <MailOutlined title={"邮件通知"} />} {it.noticeData?.wechat && <WechatOutlined title={"微信公众号推送"} />}</span>
              { userList.find((item )=> item.id === it.userId)?.name} </div>;
          })}</span>
        </div>);
      }
    },
    {
      title: "点位",
      dataIndex: "deviceGroupId",
      key: "deviceGroupId",
      align: "center",
      render: (text) => <span>{groupList.find((it)=> it.id === text)?.name}</span>
    },
    {
      title: "设备",
      dataIndex: "deviceManageId",
      key: "deviceManageId",
      align: "center",
      render: (text) => <span className={"base-color-device"}>{deviceList.find((it)=> it.id === text)?.name}</span>
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
      title: "状态",
      dataIndex: "handler",
      key: "handler",
      align: "center",
      render(text) {
        return <Tag color={text? "success":"processing"}>{text?"已处理":"未处理"}</Tag>;
      }
    },
    {
      title: "操作",
      dataIndex: "handler2",
      key: "handler2",
      align: "center",
      render(_, record, i) {
        return <Button disabled={record.handler || _role.get()!=="ROOT"} className={"base-color-clickable"} type={"text"} onClick={()=>onHandle(record, i)} size={"small"}>处理</Button>;
      }
    }

  ];

  const navigate = useNavigate();
  const onHandle = async function(event, index) {
    const data = [...dataSource];
    data[index].handler = true;
    await fetchRecordUpdate(data[index]);
    setDataSource(data);
  };
  const fetchData = function(deviceId, groupId, currentPage, size) {
    setLoading(true);
    const data = form.getFieldsValue();
    fetchRecordSearch({
      name,
      ...data,
      deviceManageIds: deviceId,
      deviceGroupId: groupId,
      currentPage,
      size
    }).then((res) => {
      setDataSource((res?.records || []).map((it) => {
        return {
          ...it,
          online: it.online || "--"
        };
      }));
      setTotal(res.total);
    }).finally(() => {
      setLoading(false);
    });
  };

  const autoFetchData = function() {
    const {deviceManageIds, noticeUserIds, deviceGroupId, date} = form.getFieldsValue();
    fetchRecordSearch({
      deviceManageIds,
      deviceGroupId,
      noticeUserIds,
      start: dayjs(date?.[0]).format(format),
      end: dayjs(date?.[1]).format(format),
      currentPage,
      size
    }).then((res) => {
      setDataSource((res?.records || []).map((it) => {
        return {
          ...it,
          online: it.online || "--"
        };
      }));
      setTotal(res.total);
    }).finally(() => {
      setLoading(false);
    });
  };
  const getSensorType = async function() {
    const _data = await fetchSensorType();
    setSensorTypeList(_data);
  };
  useMount(() => {
    const gid = params.get("groupId");
    const did = params.get("deviceId");
    const gn = params.get("groupName");
    const dn = params.get("deviceName");
    setGroupId(gid);
    setDeviceId(did);
    setDeviceName(dn);
    setGroupName(gn);
    fetchData(did, gid, currentPage, size);
    getSensorType();
  });

  const onPageChange = function(i) {
    setCurrentPage(i);

    fetchData(deviceId, groupId, i, size);
  };

  const onRest = function() {
    form.resetFields();
    setGId(null);
    setDeviceId(null);
    onPageChange(1);
  };
  const onGroupChange = function(value) {

    setGId(value);
  };
  useDebounceEffect(()=>{

    fetchSensorList({
      ids: Array.from(new Set(dataSource.map((it)=> it.sensorManageId))).join(",")
    }).then((res)=>{
      setSensorList(res);
    });
  }, [dataSource]);
  return <Layout style={{height: "100%"}}>
    <div className="base-theme-bg"
      style={{background: "var(--background-color)"}}>
      {!groupId && <Form
        style={formStyle}
        labelAlign={"left"}
        form={form}
        layout={"inline"}>

        {!groupId && <Form.Item label={"点位"}
          name={"deviceGroupId"}>
          <GroupsSelector onChange={onGroupChange}/>
        </Form.Item>}
        {!deviceId && <Form.Item label={"设备"} name={"deviceManageIds"} >
          <DeviceSelector groupId={gId}/>
        </Form.Item>}
        <Form.Item label={"通知联系人"} name={"noticeUserIds"}>
          <Select style={{width: 120}} placeholder={"选择"} options={userList.map((it)=> {
            return {
              label: it.name,
              value: it.id
            };
          })} />
        </Form.Item>
        <Form.Item label = {"时间段"} name={"date"}>
          <DatePicker.RangePicker format={format} style={{width: 240}} />
        </Form.Item>
        <Form.Item>
          <Button onClick={autoFetchData} size={"small"} type="primary">确定</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onRest} size={"small"} type={"primary"} ghost>重置</Button>
        </Form.Item>
      </Form>
      }
      {
        groupId && (<div className="head-wrapper">
          <div className="head-wrapper-left">
            <LeftOutlined onClick={() => navigate(-1)} className={"head-wrapper-back-icon"} title={"返回"}/>
            <Breadcrumb
              items={[
                {
                  title: groupName
                },
                {
                  title: deviceName
                },
                {
                  title: "报警记录"
                }
              ]}
            />
          </div>
        </div>)
      }
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

