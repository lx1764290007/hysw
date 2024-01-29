import React, {useEffect} from "react";
import {Breadcrumb, Button, Form, Layout, Popconfirm, Select, Space, Switch, Table, Tag} from "antd";
import "./trigger.css";
import {fetchTriggerRemove, fetchTriggerSearch, fetchTriggerUpdate} from "../../libs/request/trigger";
import {useMount, useSafeState} from "ahooks";
import {useNavigate, useSearchParams} from "react-router-dom";
import {LeftOutlined, MailOutlined, WechatOutlined} from "@ant-design/icons";
import {TriggerModal, TRIGGER_TYPE} from "../../components/Trigger/Modal";
import {DeviceSelector} from "../../components/DeviceSelector/DeviceSelector";
import {GroupsSelector} from "../../components/GroupsSelector/GroupsSelector";
import {useForm} from "antd/es/form/Form";
import {fetchDeviceList} from "../../libs/request/device";
import {fetchGroupList} from "../../libs/request/group";
import {fetchUserList} from "../../libs/request/user";
import {fetchSensorList} from "../../libs/request/sensor";
import {TRIGGER_ALARM_GRADE} from "../../libs/static";
import {useHookstate} from "@hookstate/core";
import {storeRole} from "../../libs/lib";

const {Content} = Layout;

const formStyle = {
  maxWidth: "none",
  padding: 24
};

export const Trigger = () => {
  const [dataSource, setDataSource] = useSafeState([]);
  const [currentPage, setCurrentPage] = useSafeState(1);
  const size = 10;
  const [total, setTotal] = useSafeState(0);
  const [params] = useSearchParams();
  const [groupId, setGroupId] = useSafeState(null);
  const [deviceId, setDeviceId] = useSafeState(null);
  const [sensorId, setSensorId] = useSafeState(null);
  const [sensorName, setSensorName] = useSafeState(null);
  const [componentVisible, setComponentVisibleVisible] = useSafeState(false);
  const [loading, setLoading] = useSafeState(false);
  const [gId, setGId] = useSafeState(null);
  const [deviceList, setDeviceList] = useSafeState([]);
  const [groupList, setGroupList] = useSafeState([]);
  const [updateTarget, setUpdateTarget] = useSafeState({});
  const [form] = useForm();
  const [userList, setUserList] = useSafeState([]);
  const [sensorList, setSensorList] = useSafeState([]);
  const _role = useHookstate(storeRole);
  useEffect(() => {
    fetchDeviceList().then((res) => {
      setDeviceList(res);
    });
    fetchGroupList().then((res) => {
      setGroupList(res);
    });
    fetchUserList( ).then((res) => {
      setUserList(res);
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
      title: "修改日期",
      dataIndex: "updateTime",
      key: "updateTime",
      render: (text, _, i) => <span key={i}>{text}</span>,
      align: "center"
    },
    {
      title: "规则",
      dataIndex: "triggerType",
      key: "triggerType",
      align: "center",
      width: 140,
      render: (text, _1, i) => < Tag type={"success"} key = {i+1}>{TRIGGER_TYPE.find((it)=> it.value === text)?.label}</Tag>
    },
    {
      title: "联系人",
      dataIndex: "noticeSettings",
      key: "noticeSettings",
      align: "center",
      width: 150,
      render: (_1, _2, i) => {
        return (<div key={i}>

          <span>{_1?.map?.((it, _i)=>{
            // eslint-disable-next-line react/jsx-key
            return <div className="table-wrapper">
              <span className="table-icon">{it.noticeData?.email && <MailOutlined title={"邮件通知"} />} {it.noticeData?.wechat && <WechatOutlined title={"微信公众号推送"} />}</span>
              { userList.find((item )=> item.id === it.userId)?.name} </div>;
          })}</span>
        </div>);
      }
    },
    // {
    //     title: "M值",
    //     dataIndex: "valueM",
    //     key: "valueM",
    //     align: 'center'
    // },
    {
      title: "X值",
      dataIndex: "valueX",
      key: "valueX",
      align: "center"
    },
    {
      title: "Y值",
      dataIndex: "valueY",
      key: "valueY",
      align: "center"
    },

    {
      title: "设备点位",
      dataIndex: "deviceGroupId",
      key: "deviceGroupId",
      align: "center",
      render: (text) => <span>{groupList.find((it) => it.id === text)?.name}</span>
    },
    {
      title: "所属设备",
      dataIndex: "deviceManageId",
      key: "deviceManageId",
      align: "center",
      render: (text) => <span className={"base-color-device"}>{deviceList.find((it) => it.id === text)?.name}</span>
    },

    {
      title: "传感器",
      dataIndex: "sensorManageId",
      key: "sensorManageId",
      align: "center",
      render(text) {
        return <span className={"base-color-sensor"}>{(sensorName? sensorName : sensorList.find((it)=> it.id === text)?.name)}</span>;
      }
    },
    {
      title: "启用状态",
      dataIndex: "enabled",
      key: "enabled",
      align: "center",
      width: 140,
      render: (text, _1, i) => <span key = {i+1}><Switch disabled={_role.get()!=="ROOT"} onChange={(event)=> onEnableChange(event, _1, i)} checked = {
        text
      } /> </span>
    },
    {
      title: "紧急程度",
      dataIndex: "alarmGrade",
      key: "alarmGrade",
      align: "center",
      render(value) {
        const _target = TRIGGER_ALARM_GRADE.find((it)=> it.value === value) || {};
        return <span style={{color: _target.color}}>{_target.label}</span>;
      }
    },
    {
      title: "操作",
      key: "id",
      align: "center",
      render: (record) => (
        <Space size="small">
          <Button type={"text"} disabled={_role.get() !== "ROOT"} className={"base-color-clickable"} size={"small"}
            onClick={() => onUpdate(record)}>修改</Button>
          {_role.get() === "ROOT" && <Popconfirm title={"操作确认"} description="确认删除吗?"
            onConfirm={() => onDelete(record.id)}
            okText="确认"
            cancelText="取消">
            <Button type={"text"} danger>删除</Button>
          </Popconfirm>}
        </Space>
      )

    }
  ];
  const onDelete = async function(id) {
    await fetchTriggerRemove({id});
    setDataSource(dataSource.filter((it) => it.id !== id));
  };
  const navigate = useNavigate();
  const fetchData = function(deviceId, groupId, sensorId, currentPage, size) {
    setLoading(true);
    const data = form.getFieldsValue();
    fetchTriggerSearch({
      name,
      ...data,
      deviceManageIds: deviceId,
      deviceGroupId: groupId,
      sensorManageId: sensorId,
      currentPage,
      size
    }).then((res = {}) => {
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
  const onEnableChange = function(event, target, i) {
    fetchTriggerUpdate({
      ...target,
      enabled: event
    }).then((r) => {
      const _data = [...dataSource];
      _data[i].enabled = event;
      setDataSource(_data);
    }).catch((e)=> window.location.reload());
  };
  const onUpdate = function(target) {
    setUpdateTarget(target);
    onComponentVisible();
  };
  const autoFetchData = function() {
    const data = form.getFieldsValue();
    fetchTriggerSearch({
      ...data,
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
  useMount(() => {
    const gid = params.get("deviceGroupId");
    const did = params.get("deviceManageId");
    const sid = params.get("sensorId");
    const sn = params.get("sensorName");
    setGroupId(gid);
    setDeviceId(did);
    setSensorName(sn);
    setSensorId(sid);
    fetchData(did, gid, sid, currentPage, size);
  });

  const onPageChange = function(i) {
    setCurrentPage(i);

    fetchData(deviceId, groupId, sensorId, i, size);
  };
  const resetField = function() {
    setCurrentPage(1);
  };
  const onComponentVisible = function() {

    setComponentVisibleVisible(true);
  };
  const onAddTrigger = function() {
    setUpdateTarget({});
    onComponentVisible();
  };
  const onSensorAddComHide = function() {
    setComponentVisibleVisible(false);
    setUpdateTarget({});
  };
  const onSensorUpdateComHide = function() {

  };
  const onAddTriggerClose = function(refresh) {

    if (refresh) {
      resetField();
      fetchData(deviceId, groupId, sensorId, currentPage, size);
    }
    onSensorAddComHide();
  };

  const onRest = function() {
    form.resetFields();
    setGId(null);
    onPageChange(1);
  };
  const onGroupChange = function(value) {

    setGId(value);
  };
  return <Layout style={{height: "100%"}}>
    <div className="base-theme-bg"
      style={{background: "var(--background-color)"}}>
      {!groupId && <Form
        style={formStyle}

        form={form}
        layout={"inline"}>
        <Form.Item label={"触发类型"} name={"triggerType"} >
          <Select style={{width: 120}} placeholder={"选择"} options={TRIGGER_TYPE} />
        </Form.Item>
        {!groupId && <Form.Item label={"点位"} name={"deviceGroupId"}>
          <GroupsSelector onChange={onGroupChange}/>
        </Form.Item>}
        {!deviceId && <Form.Item label={"设备"} name={"deviceManageIds"}>
          <DeviceSelector groupId={gId}/>
        </Form.Item>}
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
                  title: sensorName
                },
                {
                  title: "触发器"
                }
              ]}
            />
          </div>
          {_role.get()==="ROOT" && <Button type={"text"} onClick={onAddTrigger}>添加触发器</Button>}
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

    <TriggerModal open={componentVisible}
      groupId={groupId}
      deviceId={deviceId}
      sensorName={sensorName}
      userList={userList}
      sensorId={sensorId}
      dataSource={updateTarget}
      onClose={onAddTriggerClose}
    />

  </Layout>;
};

