import React, {useEffect} from "react";
import {Button, Form, Layout, Table, Input, Select, Modal, Tag, Tabs} from "antd";
import "./task.css";
import {fetchUpdateSearch, fetchUpdateRemove, fetchUpdateAdd} from "../../libs/request/update";
import {fetchUserUpdate} from "../../libs/request/user";
import {useMount, useSafeState} from "ahooks";
import {useForm} from "antd/es/form/Form";
import {DeviceSelector} from "../../components/DeviceSelector/DeviceSelector";
import {fetchDeviceList} from "../../libs/request/device";
import {fetchFileList} from "../../libs/request/upload";
import {useHookstate} from "@hookstate/core";
import {storeRole} from "../../libs/lib";

const {Content} = Layout;

const formStyle = {
  maxWidth: "none",
  padding: 30
};
const TASK_TYPE = [
  {
    label: "更新",
    value: "update"
  },
  {
    label: "周期",
    value: "cycle"
  },
  {
    label: "重启",
    value: "restart"
  },
  {
    label: "更新ip和端口",
    value: "updateIpAndPort"
  }
];
const TYPE = [
  {
    label: "未开始",
    value: "NOT_STARTED",
    color: "#347cc2"
  },
  {
    label: "更新中",
    value: "UPDATING",
    color: "#969015"
  },
  {
    label: "成功",
    value: "SUCCESS",
    color: "#34c24c"
  },
  {
    label: "失败",
    value: "FAIL",
    color: "#b91444"
  }
];

export const UpdateTask = () => {
  const [dataSource, setDataSource] = useSafeState([]);
  const [currentPage, setCurrentPage] = useSafeState(1);
  const size = 10;
  const [total, setTotal] = useSafeState(0);
  const [loading, setLoading] = useSafeState(false);
  const [form] = useForm();
  const [deviceList, setDeviceList] = useSafeState([]);
  const [fileList, setFileList] = useSafeState([]);
  const [showModal, setShowModal] = useSafeState(false);
  const [editData, setEditData] = useSafeState(null);
  const _role = useHookstate(storeRole);
  const [selectValue, setSelectValue] = useSafeState("update");

  useEffect(()=>{
    fetchDeviceList().then((res)=>{
      setDeviceList(res);
    });
    fetchFileList().then((res)=>{
      setFileList(res?.map((it)=> {
        return {
          label: it.version,
          value: it.id
        };
      }));
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
      title: "目标设备",
      dataIndex: "deviceManageId",
      key: "deviceManageId",
      align: "center",
      render(text) {
        return <span className = "base-color-device">{deviceList.find((item)=> item.id === text)?.name}</span>;
      }
    },
    {
      title: "任务类型",
      dataIndex: "taskType",
      key: "taskType",
      align: "center",
      render(text) {
        return <Tag color = {
          "#165c75"
        }>{TASK_TYPE.find((item)=> item.value === text)?.label}</Tag>;
      }
    },
    {
      title: "更新文件",
      dataIndex: "deviceUpdateFileId",
      key: "deviceUpdateFileId",
      align: "center",
      render(text) {
        return <code style={{color: "#3eab20"}}>{fileList.find((item) => item.value === text) ?.label}</code>;
      }
    },
    {
      title: "ip",
      dataIndex: "ip",
      key: "ip",
      align: "center"
    },
    {
      title: "端口",
      dataIndex: "port",
      key: "port",
      align: "center"
    },
    {
      title: "上报周期",
      dataIndex: "reportCycle",
      key: "reportCycle",
      align: "center"
    },
    {
      title: "采样周期",
      dataIndex: "sampleCycle",
      key: "sampleCycle",
      align: "center"
    },
    {
      title: "任务状态",
      dataIndex: "taskStatus",
      key: "taskStatus",
      align: "center",
      render(text) {
        const target = TYPE.find((item)=> item.value === text);
        return <span style={{fontWeight: 600, color: target.color}}>{target?.label}</span>;
      }
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
      title: "操作",
      dataIndex: "id",
      key: "id",
      align: "center",
      render(value, record, i) {
        return _role.get()==="ROOT" && <Button onClick={()=>onRemoveHandle(value)} disabled={(record.taskStatus==="UPDATING"||record.taskStatus ==="SUCCESS")} danger type={"text"} size={"small"}>删除</Button>;
      }
    }
  ];
  const onPageChange = function(i) {
    setCurrentPage(i);
    fetchData(i, size);
  };
  const getTable = function(value) {
    let table;
    switch (value) {
      case "update":
        table = columns.filter((_item)=> _item.key !== "reportCycle" && _item.key !== "sampleCycle" && _item.key !== "port" && _item.key !== "ip");
        break;
      case "cycle":
        table = columns.filter((_item)=> _item.key !== "port" && _item.key !== "ip" && _item.key !== "deviceUpdateFileId");
        break;
      case "updateIpAndPort":
        table = columns.filter((_item)=> _item.key !== "reportCycle" && _item.key !== "sampleCycle" && _item.key !== "deviceUpdateFileId");
        break;
      case "restart":
        table = columns.filter((_item)=> _item.key === "createTime" && _item.key === "index" && _item.key === "id" && _item.key === "taskStatus");
        break;
      default:
        table = columns;
        break;
    }
    return table;
  };
  const _ITEMS = TASK_TYPE.map((it)=>{
    return {
      key: it.value,
      label: it.label,
      children: <div className="table-content base-scroll-bar">
        <Table bordered
          columns={getTable(it.value)}
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
    };
  });
  const onRemoveHandle = async function(data) {
    await fetchUpdateRemove({id: data});
    const _list = dataSource.filter((it)=> it.id !== data);
    setDataSource(_list);
  };
  const fetchData = function(currentPage, size) {
    setLoading(true);
    const data = form.getFieldsValue();
    fetchUpdateSearch({
      ...data,
      currentPage,
      size,
      taskType: selectValue
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
  const onModalHide = function() {
    setShowModal(false);
    setEditData(null);
  };
  const autoFetchData = function(key, current) {
    const data = form.getFieldsValue();
    fetchUpdateSearch({
      ...data,
      currentPage: current,
      size,
      taskType: key
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
  useMount(() => {
    fetchData(currentPage, size);
  });

  const onRest = function() {
    form.resetFields();
    onPageChange(1);
  };
  const onSubmit = async function(event) {
        editData? await fetchUserUpdate({...event, id: editData.id}):await fetchUpdateAdd(event);
        onModalHide();
        onRest();
  };
  const onModalShow = function() {
    setShowModal(true);
  };
  const onChange = function(key) {
    setCurrentPage(1);
    setSelectValue(key);
    autoFetchData(key, 1);
  };
  return <Layout style={{height: "100%"}}>
    { _role.get()==="ROOT" && <div className="base-theme-bg"
      style={{background: "var(--background-color)", position: "absolute", zIndex: 5, right: 30, marginTop: 12}}>
      <Button type = "text" onClick={onModalShow}>添加任务</Button>
    </div> }
    <Content style={{height: "100%"}}>
      <Tabs style={{padding: "10px 20px"}} defaultActiveKey={selectValue} items={_ITEMS} onChange={onChange} />
    </Content>
    <Modal open={showModal} destroyOnClose title={"添加任务"} footer={false} okText={"确定"} cancelText={"取消"} onCancel={onModalHide} closeIcon>
      <TaskAdd fileList={fileList} onSubmit={onSubmit} initialValues={editData} />
    </Modal>
  </Layout>;
};

const TaskAdd = function(props) {
  const [form] = useForm();
  const [selectValue, setSelectValue] = useSafeState(undefined);

  const onSubmit = function() {
    form.validateFields().then((res)=>{
      props.onSubmit && props.onSubmit(res);
    }).catch((e)=>console.error(e));
  };
  return <div className = "user-add-wrapper">
    <Form
      style={formStyle}
      name = "mio_form"
      labelCol={{
        span: 8
      }}
      wrapperCol={{
        span: 12
      }}
      form={form}>
      <Form.Item label={"需要更新的设备"}
        rules={[
          {
            required: true,
            message: "选择设备"
          }
        ]}
        name={"deviceManageId"}>
        <DeviceSelector groupId={null} />
      </Form.Item>
      <Form.Item label={"任务类型"}
        rules={[
          {
            required: true,
            message: "选择任务类型"
          }
        ]}
        name={"taskType"} >
        <Select options={TASK_TYPE} placeholder={"选择"} onChange={(value)=> setSelectValue(value)} />
      </Form.Item>
      {selectValue === "update" && <Form.Item label={"更新文件"}
        rules={[
          {
            required: true,
            message: "选择文件"
          }]}
        name={"deviceUpdateFileId"} >
        <Select options={props.fileList} placeholder={"选择"} />
      </Form.Item> }
      {selectValue === "cycle" && <Form.Item label={"上报周期"}
        rules={[{
          required: true,
          message: "填写上报周期"
        }]}
        name={"reportCycle"} >
        <Input placeholder={"输入"} name={"reportCycle"} />
      </Form.Item>}
      {selectValue === "cycle" && <Form.Item label={"采样周期"}
        rules={[{
          required: true,
          message: "填写采样周期"
        }]}
        name={"sampleCycle"} >
        <Input placeholder={"输入"} name={"sampleCycle"} />
      </Form.Item> }
      {selectValue === "updateIpAndPort" && <Form.Item label={"ip"}
        rules={[{
          required: true,
          message: "填写ip"
        }]}
        name={"ip"} >
        <Input placeholder={"输入"} name={"ip"} />
      </Form.Item> }
      {selectValue === "updateIpAndPort" && <Form.Item label={"端口"}
        rules={[{
          required: true,
          message: "填写端口"
        }]}
        name={"port"} >
        <Input placeholder={"输入"} name={"port"} />
      </Form.Item> }
      <Button onClick={onSubmit} type={"primary"} style={{position: "absolute", right: 30}}>确定</Button>
    </Form>
  </div>;
};
