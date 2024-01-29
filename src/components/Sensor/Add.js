import * as React from "react";
import {Form, Input, Modal, Select} from "antd";
import {BarcodeOutlined, AimOutlined} from "@ant-design/icons";
import {fetchSensorType, fetchSensorAdd} from "../../libs/request/sensor";
import {useEffect} from "react";
import {useSafeState} from "ahooks";

const layout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 14
  }
};

export function Add(prop) {
  const [form] = Form.useForm();
  const [sensorTypes, setSensorTypes] = useSafeState([]);

  const setSensorType = function() {
    fetchSensorType().then((res)=>{
      if (res instanceof Array) {
        const _res = res.map((it)=>{
          return {
            label: it.webView,
            value: it.sensorType
          };
        });
        setSensorTypes(_res);
      }

    });
  };
  useEffect(()=>{
    setSensorType();
  }, []);
  const onOk = function() {
    form.validateFields().then(async (res)=>{
      const data = Object.assign({deviceGroupId: prop.groupId, deviceManageId: prop.deviceId}, res);
      await fetchSensorAdd(data);
      prop.onClose(true);
      form.resetFields();
    }).catch((e)=>{});

  };
  return (
    <Modal open={prop.open} maskClosable={false} width={400} title={"添加传感器"} onCancel={()=> prop.onClose()} onOk={onOk}>
      <Form
        name="vbn"
        {...layout}
        form={form}
        style={{marginTop: 20}}
        initialValues={{
          remember: true
        }}
        autoComplete="off"
      >

        <Form.Item
          name="name"
          label={"名称"}
          rules={[
            {
              required: true,
              message: "输入名称"
            }
          ]}
        >
          <Input prefix={<AimOutlined />}
            placeholder="名称"/>
        </Form.Item>
        <Form.Item
          name="sensorNumber"
          label={"序列号"}
          rules={[
            {
              required: true,
              message: "输入序列号"
            }
          ]}
        >
          <Input
            prefix={<BarcodeOutlined />}
            placeholder="输入序列号"
          />
        </Form.Item>
        <Form.Item
          name={"sensorType"}
          label={"传感器类型"}
          rules={[
            {
              required: true,
              message: "选择类型"
            }
          ]}>
          <Select options={sensorTypes} allowClear placeholder={"选择一个类型"} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
