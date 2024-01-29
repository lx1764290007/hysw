import React, {useEffect} from "react";
import {Breadcrumb, Button, Form, Input, Layout, Popconfirm, Space, Table} from "antd";
import "./sensor.css";
import {fetchSensorRemove, fetchSensorSearch, fetchSensorType} from "../../libs/request/sensor";
import {useMount, useSafeState} from "ahooks";
import {useNavigate, useSearchParams} from "react-router-dom";
import {LeftOutlined} from "@ant-design/icons";
import {Add as SensorAdd} from "../../components/Sensor/Add";
import {DeviceSelector} from "../../components/DeviceSelector/DeviceSelector";
import {GroupsSelector} from "../../components/GroupsSelector/GroupsSelector";
import {useForm} from "antd/es/form/Form";
import {fetchDeviceList} from "../../libs/request/device";
import {fetchGroupList} from "../../libs/request/group";
import {Update as SensorUpdate} from "../../components/Sensor/Update";
import {useHookstate} from "@hookstate/core";
import {storeRole} from "../../libs/lib";

const {Content} = Layout;

const formStyle = {
  maxWidth: "none",
  padding: 24
};

export const Sensor = () => {
  const [dataSource, setDataSource] = useSafeState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useSafeState(1);
  const size = 10;
  const [total, setTotal] = useSafeState(0);
  const [params] = useSearchParams();
  const [groupId, setGroupId] = useSafeState(null);
  const [deviceId, setDeviceId] = useSafeState(null);
  const [groupName, setGroupName] = useSafeState(null);
  const [deviceName, setDeviceName] = useSafeState(null);
  const [sensorAddComVisible, setSensorAddComVisible] = useSafeState(false);
  const [loading, setLoading] = useSafeState(false);
  const [gId, setGId] = useSafeState(null);
  const [deviceList, setDeviceList] = useSafeState([]);
  const [groupList, setGroupList] = useSafeState([]);
  const [updateTarget, setUpdateTarget] = useSafeState({});
  const [form] = useForm();
  const [sensorUpdateComVisible, setSensorUpdateComVisible] = useSafeState(false);
  const [sensorTypeList, setSensorTypeList] = useSafeState([]);
  const _role = useHookstate(storeRole);
  useEffect(()=>{
    fetchDeviceList().then((res) => {
      setDeviceList(res);
    });
    fetchGroupList().then((res)=>{
      setGroupList(res);
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
      title: "名称",
      dataIndex: "name",
      key: "name",
      align: "center"
    },
    {
      title: "传感器类型",
      dataIndex: "sensorType",
      key: "sensorType",
      align: "center",
      render: (text)=> <span className={"base-color-sensor"}>{sensorTypeList.find((it) => it.sensorType === text)?.webView}</span>
    },
    {
      title: "传感器序列号",
      dataIndex: "sensorNumber",
      key: "sensorNumber",
      align: "center"
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      key: "updateTime",
      render: (text, _, i) => <span key={i}>{text}</span>,
      align: "center"
    },
    {
      title: "设备点位",
      dataIndex: "deviceGroupId",
      key: "deviceGroupId",
      align: "center",
      render: (text) => <span>{groupList.find((it)=> it.id === text)?.name}</span>
    },
    {
      title: "所属设备",
      dataIndex: "deviceManageId",
      key: "deviceManageId",
      align: "center",
      render: (text) => <span className={"base-color-device"}>{deviceList.find((it)=> it.id === text)?.name}</span>
    },
    {
      title: "最近接受数据时间",
      dataIndex: "online",
      key: "online",
      align: "center"
    },
    {
      title: "操作",
      key: "id",
      align: "center",
      render: (record) => (
        <Space size="small">
          {_role.get() === "ROOT" && <Button type={"text"} style={{color: "#128833"}} size={"small"} onClick={()=>onUpdate(record)}>修改</Button>}
          <Button type="test" style={{color: "#10b1c7"}} size={"small"} onClick={()=>toTrigger(record)}>触发器</Button>
          <Button type="test" style={{color: "#9f2fe1"}} size={"small"} onClick={()=>toCollect(record)}>采集记录</Button>
          {_role.get() === "ROOT" && <Popconfirm title={"操作确认"} description="确认删除吗?" onConfirm={() => onDelete(record.id)}
            okText="确认"
            cancelText="取消">
            <Button type={"text"} danger>删除</Button>
          </Popconfirm>}
        </Space>
      )

    }
  ];
  const toTrigger = function(params) {
    const {deviceGroupId, deviceManageId, id, name} = params;
    navigate("/trigger?" +
            `deviceGroupId=${deviceGroupId}` +
            `&deviceManageId=${deviceManageId}`+
            `&sensorId=${id}`+
            `&sensorName=${name}`

    );
  };
  const toCollect = function(params) {
    const {id} = params;
    navigate("/collect?" +
        `sensorId=${id}`
    );
  };
  const onDelete = async function(id) {
    await fetchSensorRemove({id});
    setDataSource(dataSource.filter((it) => it.id !== id));
  };

  const fetchData = function(deviceId, groupId, currentPage, size) {
    setLoading(true);
    const data = form.getFieldsValue();
    fetchSensorSearch({
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
  const onUpdate = function(target) {
    setUpdateTarget(target);
    setSensorUpdateComVisible(true);
  };
  const autoFetchData = function() {
    const data = form.getFieldsValue();
    fetchSensorSearch({
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
  const getSensorType = async function() {
    const _data = await fetchSensorType();
    setSensorTypeList(_data);
  };
  const onPageChange = function(i) {
    setCurrentPage(i);

    fetchData(deviceId, groupId, i, size);
  };
  const resetField = function() {

    setCurrentPage(1);
  };
  const onSensorAddComVisible = function() {
    setSensorAddComVisible(true);
  };
  const onSensorAddComHide = function() {
    setSensorAddComVisible(false);
  };
  const onSensorUpdateComHide = function() {
    setSensorUpdateComVisible(false);
  };
  const onAddSensorCancel = function(refresh) {
    onSensorAddComHide();
    if (refresh) {
      resetField();
      fetchData(deviceId, groupId, currentPage, size);
    }
  };
  const onUpdateSensorCancel = function(refresh) {
    onSensorUpdateComHide();
    if (refresh) {
      fetchData(deviceId, groupId, currentPage, size);
    }
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
        <Form.Item label="序列号" name={"sensorNumber"}>
          <Input placeholder="输入序列号"/>
        </Form.Item>
        <Form.Item label="名称" name={"name"}>
          <Input placeholder="输入名称"/>
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
                  title: groupName
                },
                {
                  title: deviceName
                },
                {
                  title: "传感器"
                }
              ]}
            />
          </div>{_role.get() === "ROOT" && <Button type={"text"} onClick={onSensorAddComVisible}>添加传感器</Button> }
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

    <SensorAdd open={sensorAddComVisible}
      groupId={groupId}
      deviceId={deviceId}
      onClose={onAddSensorCancel}
    />
    <SensorUpdate open={sensorUpdateComVisible}
      groupId={groupId}
      deviceId={deviceId}
      dataSource={updateTarget}
      onClose={onUpdateSensorCancel} />
  </Layout>;
};

