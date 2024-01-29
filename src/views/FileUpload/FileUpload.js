import React from "react";
import {Layout, message, Table, Tabs, Upload, Modal, Button} from "antd";
import {InboxOutlined} from "@ant-design/icons";
import Style from "./file.module.css";
import {fetchFileList, UPLOAD_URL} from "../../libs/request/upload";
import {useMount, useSafeState} from "ahooks";
import {useHookstate} from "@hookstate/core";
import {storeRole} from "../../libs/lib";


const {Dragger} = Upload;
const {Content} = Layout;

const props = {
  name: "file",
  multiple: false,
  action: UPLOAD_URL,
  crossOrigin: "use-credentials",
  onChange(info) {
    const {status} = info.file;
    if (status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (status === "done") {
      message.success(`${info.file.name} 已上传.`);
    } else if (status === "error") {
      message.error(`${info.file.name} 上传失败.`);
    }
  },
  onDrop(e) {
    console.log("Dropped files", e.dataTransfer.files);
  }
};
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
    title: "文件",
    dataIndex: "version",
    key: "version",
    align: "center",
    render(text) {
      return <code style={{color: "#3eab20"}}>{text}</code>;
    }
  },
  {
    title: "文件大小",
    dataIndex: "fileSize",
    key: "fileSize",
    align: "center"
  },
  {
    title: "crc校验",
    dataIndex: "crc",
    key: "crc",
    align: "center"
  }
];
export const FileUpload = function() {
  const [dataSource, setDataSource] = useSafeState([]);
  const [open, setOpen] = useSafeState(false);
  const _role = useHookstate(storeRole);
  const getFileList = function() {
    fetchFileList().then((res=[])=>{
      setDataSource(res);
    });
  };
  useMount(getFileList);
  const onCancel = function() {
    setOpen(false);
    getFileList();
  };

  return (
    <Layout style={{height: "100%"}}>
      <div className="base-theme-bg"
        style={{background: "var(--background-color)", height: "100%"}}>
        <div style={{padding: "16px 30px", textAlign: "right"}}>
          {_role.get()==="ROOT" && <Button type={"text"} onClick={()=> setOpen(true)}>上传文件</Button>}
        </div>
        <Content>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </Content>
        <Modal title={"上传文件"} open={open} footer={false} onCancel={onCancel}>
          <div className = {Style.wrapper}><Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">拖动文件到这里或点击选择文件</p>
            <p className="ant-upload-hint">
              支持单个文件
            </p>
          </Dragger></div>
        </Modal>
      </div>
    </Layout>
  );
};
