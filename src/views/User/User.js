import React, {useEffect} from "react";
import {Button, Form, Layout, Table, Input, Switch, Select, Modal, Space, Popconfirm} from "antd";
import "./user.css";
import {fetchUserSearch, fetchUserUpdate, fetchUserRemove, fetchUserAdd, fetchRoleList} from "../../libs/request/user";
import {useMount, useSafeState} from "ahooks";
import {useForm} from "antd/es/form/Form";
import vcSubscribePublish from "vc-subscribe-publish";
import {useHookstate} from "@hookstate/core";
import {storeRole} from "../../libs/lib";

const {Content} = Layout;

const formStyle = {
  maxWidth: "none",
  padding: 30
};
const responseData = {
  "createTime": "",
  "email": "",
  "enabled": true,
  "gender": "",
  "loginName": "",
  "name": "",
  "phone": "",
  "wechatOpenId": ""
};
export const UserTable = () => {
  const [dataSource, setDataSource] = useSafeState([]);
  const [currentPage, setCurrentPage] = useSafeState(1);
  const size = 10;
  const [total, setTotal] = useSafeState(0);
  const [loading, setLoading] = useSafeState(false);
  const [form] = useForm();
  const [role, setRole] = useSafeState([]);
  const [showModal, setShowModal] = useSafeState(false);
  const [editData, setEditData] = useSafeState(null);
  const [pwdTargetId, setPwdTargetId] = useSafeState(null);
  const [pwdOpen, setPwdOpen] = useSafeState(false);
  const [pwdValue, setPwdValue] = useSafeState(null);
  const _role = useHookstate(storeRole);
  useEffect(()=>{
    fetchRoleList().then((res)=>{
      setRole(res?.map((it)=>{
        return {
          value: it.id,
          label: it.name
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
      title: "姓名",
      dataIndex: "name",
      key: "name",
      align: "center"
    },
    {
      title: "用户名",
      dataIndex: "loginName",
      key: "loginName",
      align: "center",
      maxWidth: 220
    },
    {
      title: "手机号",
      dataIndex: "phone",
      key: "phone",
      align: "center"
    },
    {
      title: "邮箱",
      dataIndex: "mail",
      key: "mail",
      align: "center"
    },
    {
      title: "微信识别码",
      dataIndex: "wechatOpenId",
      key: "wechatOpenId",
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
      title: "账号状态",
      dataIndex: "enabled",
      key: "enabled",
      align: "center",
      render(text, _, i) {
        return <Switch disabled={_role.get()!=="ROOT"} defaultChecked = {text} title={text? "启用":"未启用"} onChange={(event)=> onUpdate(i, "enabled", event)} />;
      }
    },
    {
      title: "用户角色",
      dataIndex: "roleId",
      key: "roleId",
      align: "center",
      width: 200,
      render(text, _, i) {
        return <Select disabled={_role.get()!=="ROOT"} style={{width: 160}} placeholder={"选择"} options={role} defaultValue = {text} onChange={(event)=> onUpdate(i, "roleId", event)} />;
      }
    },
    {
      title: "操作",
      dataIndex: "id",
      key: "id",
      align: "center",
      render(value, record, i) {
        return <>{_role.get()==="ROOT" && <Space>
          <Button size={"small"} type={"text"} onClick={()=> onChangePassword(value)} className={"base-color-clickable"}>修改密码</Button>
          <Button size={"small"} type={"text"} onClick={()=> onHandle(record, i)} className={"base-color-warn"}>编辑</Button>
          <Popconfirm onConfirm={()=>onRemoveHandle(value)} title={"确认删除吗？"}><Button danger type={"text"} size={"small"}>删除</Button></Popconfirm>
        </Space>}</>;
      }
    }

  ];
  const onHandle = async function(_data) {
    setEditData(_data);
    onModalShow();
  };
  const onChangePassword = function(id) {
    onPwdShow();
    setPwdTargetId(id);
  };
  const onRemoveHandle = async function(data) {
    await fetchUserRemove({id: data});
    const _list = dataSource.filter((it)=> it.id !== data);
    setDataSource(_list);
  };
  const fetchData = function(currentPage, size) {
    setLoading(true);
    const data = form.getFieldsValue();
    fetchUserSearch({
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
      setTotal(res?.total);
    }).finally(() => {
      setLoading(false);
    });
  };
  const onUpdate = async function(i, key, value) {
    const _d = [...dataSource];
    if (_d[i][key]) {
      _d[i][key] = value;
      await fetchUserUpdate(_d[i]);
      setDataSource(_d);
    }
  };
  const onModalShow = function() {
    setShowModal(true);
  };
  const onModalHide = function() {
    setShowModal(false);
    setEditData(null);
  };
  const autoFetchData = function() {
    const data = form.getFieldsValue();
    fetchUserSearch({
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
      setTotal(res?.total);
    }).finally(() => {
      setLoading(false);
    });
  };
  useMount(() => {
    fetchData(currentPage, size);
  });

  const onPageChange = function(i) {
    setCurrentPage(i);

    fetchData(i, size);
  };

  const onRest = function() {
    form.resetFields();
    onPageChange(1);
  };
  const onSubmit = async function(event) {
    editData? await fetchUserUpdate({...event, id: editData.id}):await fetchUserAdd(event);
    onModalHide();
    onRest();
  };
  const onPwdCancel = function() {
    setPwdOpen(false);
    setPwdTargetId(null);
  };
  const onPwdShow = function() {
    setPwdOpen(true);
  };
  const onPwdOk = async function() {
    if (pwdValue && pwdValue.length>=6 && pwdValue.length<=24) {
      await fetchUserUpdate({
        id: pwdTargetId,
        password: pwdValue
      });
      onPwdCancel();
    } else {
      vcSubscribePublish.public("onMessage", "error", "密码长度不小于6且不大于24");
    }
  };
  const onPwdInput = function(event) {
    setPwdValue(event.target.value);
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

        <Form.Item label={"姓名"}
          name={"name"}>
          <Input placeholder={"输入"} />
        </Form.Item>
        <Form.Item label={"用户名"} name={"loginName"} >
          <Input placeholder={"输入"} />
        </Form.Item>
        <Form.Item label={"手机号"} name={"phone"} >
          <Input placeholder={"输入"} type={"number"} />
        </Form.Item>
        <Form.Item>
          <Button onClick={autoFetchData} size={"small"} type="primary">确定</Button>
        </Form.Item>
        <Form.Item>
          <Button onClick={onRest} size={"small"} type={"primary"} ghost>重置</Button>
        </Form.Item>
        <Button type = "test" style={{float: "right", position: "absolute", right: 24}} onClick={onModalShow}>添加用户</Button>
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
    <Modal open={showModal} destroyOnClose title={editData? "编辑用户":"添加用户"} footer={false} okText={"确定"} cancelText={"取消"} onCancel={onModalHide} closeIcon>
      <UserAdd roles={role} onSubmit={onSubmit} initialValues={editData} />
    </Modal>
    <Modal width={400} open={pwdOpen} destroyOnClose title={"修改密码"} onCancel={onPwdCancel} onOk={onPwdOk} okText={"确定"} cancelText={"取消"}>
      <Input style={{marginTop: 20, marginBottom: 20}} placeholder={"输入密码"} min={6} max={24} onInput={onPwdInput} />
    </Modal>
  </Layout>;
};

const UserAdd = function(props) {
  const [form] = useForm();
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
        span: 6
      }}
      wrapperCol={{
        span: 16
      }}
      initialValues={props.initialValues}
      form={form}>
      <Form.Item label={"姓名"}
        rules={[
          {
            required: true,
            message: "请输入真实姓名"
          }
        ]}
        name={"name"}>
        <Input placeholder={"输入"} />
      </Form.Item>
      <Form.Item label={"用户名"}
        rules={[
          {
            required: true,
            message: "请输入账号"
          },
          {
            max: 24,
            message: "最长24位"
          },
          {
            min: 4,
            message: "最短4位"
          }
        ]}
        name={"loginName"} >
        <Input placeholder={"输入"} />
      </Form.Item>
      {!props.initialValues && <Form.Item label={"密码"}
        rules={[
          {
            required: true,
            message: "请输入密码"
          },
          {
            max: 24,
            message: "密码最长24位"
          },
          {
            min: 6,
            message: "密码最短6位"
          }
        ]}
        name={"password"} >
        <Input placeholder={"输入"} />
      </Form.Item>}
      <Form.Item label={"手机号"}
        rules={[
          {
            required: true,
            message: "请输入11位数手机号码"
          }, {
            max: 11,
            message: "超过最大长度"
          }, {
            min: 11,
            message: "手机号格式不正确"
          }]}
        name={"phone"} >
        <Input placeholder={"输入"} />
      </Form.Item>
      <Form.Item label={"邮箱"}
        rules={[{
          type: "email",
          message: "邮箱格式不正确"
        }, {required: true, message: "输入邮箱"}]}
        name={"email"} >
        <Input placeholder={"输入"} />
      </Form.Item>
      <Form.Item label={"用户角色"} name={"roleId"} rules={[{required: true, message: "请选择权限"}]}>
        <Select style={{width: 160}} placeholder={"选择"} options={props.roles} />
      </Form.Item>
      <Button onClick={onSubmit} type={"primary"} style={{position: "absolute", right: 30}}>确定</Button>
    </Form>
  </div>;
};
