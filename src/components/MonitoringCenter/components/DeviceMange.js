import React, {useEffect} from "react";
import {Button, Divider, Empty, Form, Input, Modal, Popconfirm} from "antd";
import {useSafeState} from "ahooks";
import {DeviceIcon, dataSource} from "../../Icon/DeviceIcons";
import {IconFont} from "../../Icon/IconFont";
import "./device.css";
import {
  BarcodeOutlined,
  FontColorsOutlined,
  PlusOutlined,
  EditOutlined
} from "@ant-design/icons";
import {fetchDeviceAdd, fetchDeviceList, fetchDeviceRemove, fetchDeviceUpdate} from "../../../libs/request/device";
import {MyMap} from "../../BigSurMap/MyMap";
import vcSubscribePublish from "vc-subscribe-publish";

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 12},
  labelAlign: "right",
  align: "left"
};

const DEFAULT_ICON = dataSource[0].value;

// eslint-disable-next-line require-jsdoc
function MyForm(prop) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useSafeState(false);
  const [show, setShow] = useSafeState(false);
  const [iconVisible, setIconVisible] = useSafeState(false);
  const [icon, setIcon] = useSafeState(DEFAULT_ICON);
  const [iconTemp, setIconTemp] = useSafeState(DEFAULT_ICON);
  const [position, setPosition] = useSafeState(null);
  const [formPosition, setFormPosition] = useSafeState(null);
  const onOpen = function() {
    setShow(true);
  };
  const onClose = function() {
    setShow(false);
  };
  const onSelectPosition = function(event) {
    setPosition(event);
  };
  const onSelectPositionCancel = function() {
    setPosition(null);
    setFormPosition(null);
  };
  const onSelectOk = function() {
    setFormPosition(position);
    onClose();
  };
  const onSelectIconOk = function() {
    setIcon(iconTemp);
    onIconClose();
  };
  const onIconClose = function() {
    setIconVisible(false);
  };
  const onIconOpen = function() {
    setIconVisible(true);
  };
  const onIconClick = function(evt) {
    setIconTemp(evt.value);
  };

  const onNewStateCompleteHandle = function() {
    form?.validateFields( ).then(async (res)=>{
      setLoading(true);
      const {offsetX, offsetY} = formPosition;
      if (prop.dataSource) {
        await fetchDeviceUpdate(Object.assign(res, {deviceGroupId: prop.groupId, id: prop.dataSource.id, latitude: offsetY, longitude: offsetX, iconData: icon}));
        changeActiveHandleAndRefresh();
      } else {
        await fetchDeviceAdd(Object.assign(res, {deviceGroupId: prop.groupId, latitude: offsetY, longitude: offsetX, iconData: icon}));
        changeActiveHandleAndRefresh();
      }
      vcSubscribePublish.public("onMessage", "已保存");
      setLoading(false);
    }).catch((e)=> setLoading(false));

  };
  const changeActiveHandleAndRefresh = function() {
    form.resetFields();
    prop.onRefresh?.();
    prop.onRemove?.();
  };
  const onNewStateRemoveHandle = function() {
    form.resetFields();
    if (prop.dataSource) {
      fetchDeviceRemove({
        id: prop.dataSource.id
      }).then(()=>{
        prop.onRemove?.(prop.dataSource.id);
      });
    } else {
      prop.onRemove?.();
    }
  };
  useEffect(()=>{
    if (prop.dataSource) {
      setIconTemp(prop.dataSource.iconData || DEFAULT_ICON);
      setIcon(prop.dataSource.iconData || DEFAULT_ICON);
      setFormPosition({
        offsetY: Number(prop.dataSource.latitude),
        offsetX: Number(prop.dataSource.longitude),
        icon: prop.dataSource.iconData || DEFAULT_ICON
      });
      setPosition({
        offsetY: Number(prop.dataSource.latitude),
        offsetX: Number(prop.dataSource.longitude),
        icon: prop.dataSource.iconData || DEFAULT_ICON
      });
    }
  }, [prop.dataSource]);
  return (
    <React.Fragment>
      {!prop.isNewState && <Divider style={{fontSize: "smaller"}} orientation={"left"}>设备{prop.index + 1 }</Divider>}
      <Form
        name={Math.random().toFixed(4)}
        {...layout}
        form={form}
        layout={"horizontal"}
        autoComplete="off"
        initialValues={prop.dataSource}
      >
        <Form.Item
          name={"name"}
          rules={[
            {
              required: true,
              message: "输入设备名称"
            }
          ]}
          label={"设备名"}
        >
          {
            <Input prefix={<FontColorsOutlined/>}
              name={"name"}
              style={{width: "100%"}}
              readOnly={!prop.edit && prop.dataSource}
              placeholder="设备名称"/>
          }
        </Form.Item>
        <Form.Item
          name={"deviceNumber"}
          label={"序列号"}
          rules={[
            {
              required: true,
              message: "输入设备序列号"
            }
          ]}
        >
          <Input prefix={<BarcodeOutlined/>}
            name={"deviceNumber"}
            readOnly={!prop.edit && prop.dataSource}
            style={{width: "100%"}}
            placeholder="设备序列号"/>
        </Form.Item>
        <Form.Item
          name={"icon"}
          label={"选择一个图标"}
          rules={[
            {
              required: false,
              message: "选择"
            }
          ]}
        >
          <Button type={"primary"}
            ghost
            disabled={!prop.edit && prop.dataSource}
            onClick={onIconOpen}> <IconFont style={{fontSize: 22}} type={icon} /> </Button>
        </Form.Item>
        <Form.Item
          name={"position"}
          label={"选择安装位置"}
          rules={[
            {
              required: true,
              message: "请选择",
              validateTrigger: "click",
              validator(val) {
                if (Boolean(formPosition)) return Promise.resolve(true);
                else return Promise.reject(new Error("err"));
              }
            }
          ]}
        >
          <Button type={"primary"}
            onClick={onOpen}
            size={"small"}>{formPosition? "已选择":"未选择"}</Button>
        </Form.Item>


        <div style={{paddingTop: 20, display: (prop.edit || !prop.dataSource)? "block":"none", textAlign: "right"}}>
          <Button onClick={onNewStateCompleteHandle}
            type={"primary"} style={{marginRight: 10}} size={"small"} loading={loading}>确定</Button>
          {prop.edit && <Popconfirm
            title="提示"
            description="确定要删除吗？"
            onConfirm={onNewStateRemoveHandle}
            okText="确定"
            cancelText="取消"
          > <Button size={"small"} type={"primary"} danger>删除</Button></Popconfirm>}
        </div>

      </Form>
      <Modal title={!prop.edit && prop.dataSource? "（只读模式）":"选择一个位置"}
        width={700}
        closeIcon
        style={{
          top: 30
        }}
        open={show}
        footer={!prop.edit && prop.dataSource? false:undefined}
        onOk={onSelectOk}
        onCancel={onClose}>
        <MyMap onSelect={onSelectPosition}
          single
          icon={icon}
          disabled={!prop.edit && prop.dataSource}
          position={[position] || []} />
        {/* <Button size={"small"}*/}
        {/*  disabled={!prop.edit && prop.dataSource}*/}
        {/*  onClick={onSelectPositionCancel}*/}
        {/*  className={"device-manage-button-clear"}>清除标记</Button>*/}
      </Modal>
      <Modal title={"选择图标"}
        width={420}
        closeIcon
        style={{top: 100}}
        open={iconVisible}
        footer={!prop.edit && prop.dataSource? false:undefined}
        onOk={onSelectIconOk}
        onCancel={onIconClose}>
        <DeviceIcon onClick={onIconClick} />
      </Modal>
    </React.Fragment>
  );
}

// eslint-disable-next-line require-jsdoc
export function DeviceMange(prop) {
  const [newState, setNewState] = useSafeState(false);
  const [deviceList, setDeviceList] = useSafeState([]);
  const [editState, setEditState] = useSafeState(false);

  const getDeviceData = function() {
    fetchDeviceList({
      deviceGroupId: prop.groupId
    }).then((list) => {
      setDeviceList(list);
    });
  };
  useEffect(() => {
    if (prop.groupId) {
      getDeviceData();
    }
  }, [prop.groupId]);


  const onNewStateActiveHandle = function() {
    setNewState(true);
  };

  const editToggleHandle = function() {
    setEditState(!editState);
  };

  const onDeviceListRemove = function(deviceId) {
    const list_ = deviceList.filter((item)=> item.id !== deviceId);
    setDeviceList(list_);
  };
  const handleCancel = function(refresh = true) {
    prop?.onClose?.(refresh);
  };
  return (
    <Modal title={prop.title + "的设备"} width={editState? 530 : 500} closeIcon footer={false} open={prop.show} onCancel={handleCancel}>
      <div className={"device-manage-button-add-device"}>
        <Button type={"text"} prefix="PlusOutlined"
          onClick={onNewStateActiveHandle} icon={<PlusOutlined />}>添加设备</Button>
        <Button type={"text"} prefix="PlusOutlined"
          onClick={editToggleHandle} icon={<EditOutlined />}>{editState? "锁定修改":"修改"}</Button>
      </div>
      <div className={"device-manage-wrapper_ base-scroll-bar"}>
        {deviceList?.length > 0 && deviceList.map((item, index)=> <div key={item.id} className={"device-manage-add-device-wrapper"}>
          <MyForm groupId={prop.groupId}
            dataSource={item}
            edit={editState}
            index={index}
            onRemove={onDeviceListRemove} />
        </div>)}

        {deviceList?.length < 1 && !newState && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>}
      </div>
      <Modal title={"新增设备"} width={420} closeIcon open={newState} footer={false} onCancel={()=>setNewState(false)}>
        <div className="device-manage-add-device-wrapper-fixed">
          <MyForm groupId={prop.groupId} isNewState={newState} index={deviceList?.length} onRefresh={getDeviceData} onRemove={()=>setNewState(false)} />
        </div>
      </Modal>
    </Modal>
  );
}
