import * as React from "react";
import {useEffect} from "react";
import {Button, Checkbox, Col, Divider, Form, Input, Modal, Popover, Row, Select, Switch} from "antd";
import {AimOutlined, CaretDownOutlined, DeleteOutlined, MailOutlined, WechatOutlined} from "@ant-design/icons";
import {useSafeState} from "ahooks";
import "./modal.css";
import vcSubscribePublish from "vc-subscribe-publish";
import {fetchTriggerAdd, fetchTriggerUpdate} from "../../libs/request/trigger";
import {TRIGGER_ALARM_GRADE} from "../../libs/static";

export const TRIGGER_TYPE = [
  {
    label: "大于 X",
    value: "GREATER_THAN_X"
  },
  {
    label: "小于 Y",
    value: "LESS_THAN_Y"
  },
  {
    label: "等于 X",
    value: "EQUALS_X"
  },
  {
    label: "不等于 X",
    value: "NOT_EQUALS_X"
  },
  {
    label: "大于 X 或 Y",
    value: "GT_X_OR_LT_Y"
  },
  {
    label: "在 X 和 Y 之间",
    value: "BETWEEN_X_AND_Y"
  }
];


const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 24
  }
};

const MyForm = function(prop) {
  const [type, setType] = useSafeState(null);
  useEffect(() => {
    setType(prop.dataSource?.triggerType);
    prop.form.resetFields();
  }, [prop.dataSource]);

  const onSelect = function(event) {
    setType(event);
  };
  return <div style={{position: "relative"}}>

    <Form.Item
      name={"triggerType" + prop._key}
      label={"选择触发类型"}
      initialValue={prop.dataSource?.triggerType}
      rules={[
        {
          required: true,
          message: "选择触发类型"
        }
      ]}
    >
      <Select options={TRIGGER_TYPE} placeholder={"选择"} onSelect={onSelect}/>
    </Form.Item>
    <Form.Item
      name={"alarmGrade" + prop._key}
      label={"选择紧急程度"}
      initialValue={prop.dataSource?.alarmGrade}
      rules={[
        {
          required: true,
          message: "选择"
        }
      ]}
    >
      <Select options={TRIGGER_ALARM_GRADE} placeholder={"选择"} />
    </Form.Item>
    {
      (type?.endsWith?.("X") || /AND|OR/g.test(type)) && <Form.Item
        initialValue={prop.dataSource?.valueX}
        name={"valueX" + prop._key}
        label={"填写X值"}
        rules={[
          {
            required: true,
            message: "填写"
          }
        ]}
      >
        <Input placeholder="填写X值"/>
      </Form.Item>
    }
    {
      (type?.endsWith?.("Y") || /AND|OR/g.test(type)) && <Form.Item
        name={"valueY" + prop._key}
        initialValue={prop.dataSource?.valueY}
        label={"填写Y值"}
        rules={[
          {
            required: true,
            message: "填写"
          }
        ]}
      >
        <Input placeholder="填写Y值"/>
      </Form.Item>
    }
    <Form.Item name={"enabled" + prop._key}
      label={"是否启用"}
      valuePropName="checked"
      initialValue={prop.dataSource?.enabled === undefined ? true : prop.dataSource?.enabled}>
      <Switch name={"enabled" + prop._key} />
    </Form.Item>
    {
      !prop.dataSource.noticeSettings && <Button type={"text"}
        onClick={() => prop.onRemove(prop._key)}
        className={"delete-item"} danger>
        <DeleteOutlined/>删除规则
      </Button>
    }
  </div>;
};
const Content = function(prop) {
  const [defaultValue, setDefaultValue] = useSafeState(["wechat", "email"]);
  React.useEffect(() => {
    if (prop.dataSource) {
      setDefaultValue(Object.keys(prop.dataSource.noticeData).filter((it) => prop.dataSource.noticeData[it]));
    } else {
      setDefaultValue(["wechat", "email"]);
    }
  }, [prop.dataSource]);
  const onChange = function(values) {
    setDefaultValue(values);
    prop?.onChange(values);
  };
  return (
    <React.Fragment>
      <Checkbox.Group onChange={onChange}
        defaultValue={defaultValue}
        value={defaultValue}>
        <Row>
          <Col span={24}><Checkbox value={
            "wechat"
          }><WechatOutlined /> 微信</Checkbox></Col>
        </Row>
        <Row>
          <Col span={24}><Checkbox value={
            "email"
          }><MailOutlined /> 邮件</Checkbox></Col>
        </Row>
      </Checkbox.Group>

    </React.Fragment>
  );
};
const UserPicker = function(prop) {
  const [userList, setUserList] = useSafeState([]);
  const [selectedUserList, setSelectedUserList] = useSafeState([]);

  React.useEffect(() => {
    if (prop.userList) {
      setUserList(prop.userList);
    }
  }, [prop.userList]);

  React.useEffect(() => {
    if (prop.dataSource?.length) {
      setSelectedUserList(prop.dataSource?.map((it) => it.userId));
    } else {
      setSelectedUserList([]);
    }
  }, [prop.dataSource]);
  const onTriggerWayChangeHandle = function(value, id) {
    const data = {
      userId: id,
      noticeData: {
        email: value.includes("email"),
        wechat: value.includes("wechat")
      }
    };
    prop?.onTriggerWayChange?.(data);
  };
  const onUserPickerChange = function(values) {
    setSelectedUserList(values);
    prop.onSelectUserChange?.(values);
  };
  return (
    <div className="trigger-modal-wrapper2">
      <Checkbox.Group onChange={onUserPickerChange} value={selectedUserList}>
        {
          userList.map((item, i) => {
            return <Checkbox key={i} value={item.id}>
              <Popover content={<Content dataSource={prop.dataSource?.find((it) => it.userId === item.id)}
                onChange={(event) => onTriggerWayChangeHandle(event, item.id)}/>}
              title="通知方式"
              trigger="hover">
                <span>{item.name} <CaretDownOutlined/></span>
              </Popover>
            </Checkbox>;
          })
        }
      </Checkbox.Group>
    </div>
  );
};

export const TriggerModal = function(prop) {
  const [form] = Form.useForm();
  const [formItems, setFormItems] = useSafeState([]);

  const [showUser, setShow] = useSafeState(false);
  const [userIds, setUserIds] = useSafeState([]);
  const [triggerUserAndWay, setTriggerUserAndWay] = useSafeState([]);
  const [userPickerValue, setUserPickerValue] = useSafeState([]);

  useEffect(() => {
    if (prop.dataSource?.noticeSettings) {
      setUserIds(prop.dataSource.noticeSettings.map?.((it) => it?.userId));
      setTriggerUserAndWay(prop.dataSource.noticeSettings);
      setUserPickerValue(prop.dataSource.noticeSettings);
      setFormItems([1]);

    } else {
      setUserIds([]);
      setTriggerUserAndWay([]);
      setUserPickerValue([]);
      setFormItems([]);
    }
    form.resetFields();
  }, [prop.dataSource]);
  const onOk = function() {
    if (formItems.length < 1) {
      vcSubscribePublish.public("onMessage", "error", "没有配置规则~");
      return;
    }
    form.validateFields().then(async (res) => {
      let targets = Array.from(new Set(Object.keys(res).map((it) => Number(it.substring(it.length - 1))).filter((it) => !isNaN(it))));

      let result = targets.map((_, i) => {
        return {
          triggerType: res[`triggerType${i}`],
          enabled: res[`enabled${i}`],
          alarmGrade: res[`alarmGrade${i}`],
          valueM: res[`valueM${i}`],
          valueX: res[`valueX${i}`] || "",
          valueY: res[`valueY${i}`] || ""
        };
      });
      if (prop.dataSource.id) {
        await fetchTriggerUpdate({
          ...prop.dataSource,
          sensorManageId: Number(prop.sensorId),
          noticeSettings: userPickerValue,
          ...result[0],
          id: prop.dataSource.id
        });

      } else {
        await fetchTriggerAdd({
          sensorManageIds: [Number(prop.sensorId)],
          noticeSettings: userPickerValue,
          wrappers: result
        });
      }

      onClose(true);
    }).catch((err) => {
      console.log(err);
    });
  };
  const onClose = function(foo) {
    prop.onClose(foo);

  };
  const onFinish = function() {

  };
  const onAdd = function() {
    setFormItems([...formItems, 1]);
  };
  const onRemove = function(key) {
    setFormItems(formItems.toSpliced(key, 1));
  };
  const onSelectUserHandle = function() {
    setShow(true);
  };
  const onHideUserHandle = function() {
    setShow(false);
  };
  const onTriggerWayChange = function(value) {

    const index = triggerUserAndWay.findIndex((it) => it.userId === value.userId);
    if (index >= 0) {
      const _t = [...triggerUserAndWay];
      _t[index] = value;
      setTriggerUserAndWay(_t);
    } else {
      setTriggerUserAndWay([...triggerUserAndWay, value]);
    }
  };
  const onAddUserConfirmHandler = function() {
    const target = userIds.map((it) => {
      const t = triggerUserAndWay.findIndex((item) => item.userId === it);
      if (t >= 0) {
        return triggerUserAndWay[t];
      } else {
        return {
          noticeData: {
            email: true,
            wechat: true
          },
          userId: it
        };
      }
    });
    setUserPickerValue(target);
    setShow(false);
  };
  const onSelectUserChange = function(values) {
    setUserIds(values);
  };
  return (
    <Modal open={prop.open}
      maskClosable={false}
      width={450}
      style={{overflowY: "hidden", minHeight: 300}}
      title={showUser ? "添加联系人" : prop.dataSource.noticeSettings ? "修改规则" : "添加规则"}
      onCancel={() => onClose(false)}
      footer={
        <React.Fragment>
          {!showUser && !prop.dataSource.noticeSettings && <Button onClick={onAdd}
            type={"text"}>添加规则</Button>}
          {!showUser && <Button type={"primary"}
            onClick={onOk}>确认</Button>}
          {showUser && <Button type="text" onClick={onHideUserHandle}>取消</Button>}
          {showUser && <Button type="primary"
            onClick={onAddUserConfirmHandler}
            ghost>确认添加</Button>}
        </React.Fragment>
      }

      onOk={onOk}>
      <div className="trigger-modal-wrapper base-scroll-bar">
        <Form
          name="normal-wrapper"
          {...layout}
          form={form}
          initialValues={{
            remember: true
          }}
          style={{display: showUser ? "none" : "block"}}
          onFinish={onFinish}
          autoComplete="off"
        >

          <Form.Item
            name="sensorManageIds"
            label={"传感器"}
            defaultValue={prop.sensorName}
            initialValue={prop.sensorName}
            rules={[
              {
                required: false,
                message: "传感器"
              }
            ]}
          >
            <Input prefix={<AimOutlined/>}
              disabled
              placeholder="传感器"/>
          </Form.Item>
          <Form.Item
            name="userId"
            label={"联系方式"}
            style={{cursor: "pointer"}}
            rules={[
              {
                required: false,
                message: "填写邮箱",
                type: "email"
              }
            ]}
          >
            <Input prefix={<MailOutlined/>}
              onClick={onSelectUserHandle}
              readOnly
              placeholder={userIds.length > 0 ? `已选${userIds.length}项目` : "选择联系人和联系方式"}/>
          </Form.Item>
          {
            formItems.map((item, key) => {
              return (
                <React.Fragment key={key}>
                  <Divider orientation={"left"} style={{fontSize: "small"}}
                    position={"left"}>触发规则 {formItems.length === 1 ? "" : key + 1}</Divider>

                  <MyForm form={form} _key={key} dataSource={prop.dataSource} onRemove={onRemove}/>
                </React.Fragment>
              );
            })
          }
        </Form>
        {showUser && <UserPicker userList={prop.userList} dataSource={userPickerValue}
          onTriggerWayChange={onTriggerWayChange}
          onSelectUserChange={onSelectUserChange}/>}
      </div>
    </Modal>
  );
};
