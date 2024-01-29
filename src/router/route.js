import {BigSur} from "../views/BigSur/BigSur";
import {MonitoringCenter} from "../views/MonitoringCenter/MonitoringCenter";
import {AimOutlined,
  AreaChartOutlined,
  FileOutlined,
  CodeOutlined,
  RadarChartOutlined,
  UngroupOutlined} from "@ant-design/icons";
import {Login} from "../views/Login/Login";
import {Sensor} from "../views/Sensor/Sensor";
import React from "react";
import {AlertOutlined, PicCenterOutlined, UserOutlined} from "@ant-design/icons";
import {Notification} from "../views/Notification/Notification";
import {Trigger} from "../views/Trigger/Trigger";
import {UserTable} from "../views/User/User";
import {Collect} from "../views/Collect/Collect";
import {FileUpload} from "../views/FileUpload/FileUpload";
import {UpdateTask} from "../views/UpdateTask/UpdateTask";
const routes = [
  {
    label: "大屏看板",
    key: "/",
    // children: [],

    icon: <AreaChartOutlined />,
    path: "/",
    component: <BigSur />
  },
  {

    label: "设备管理",
    key: "device",
    // children: [],
    // group: false,
    icon: <UngroupOutlined />,
    path: "/device",
    component: <MonitoringCenter />
  },
  {

    label: "登录",
    key: "login",
    // children: [],
    // group: false,

    icon: null,
    path: "/login",
    component: <Login />
  },
  {

    label: "传感器管理",
    key: "sensor",
    // children: [],
    // group: false,

    icon: <AimOutlined />,
    path: "/sensor",
    component: <Sensor />
  },
  {

    label: "报警记录",
    key: "notification",
    // children: [],
    // group: false,

    icon: <AlertOutlined />,
    path: "/notification",
    component: <Notification />
  },
  {

    label: "触发器",
    key: "trigger",
    // children: [],
    // group: false,

    icon: <PicCenterOutlined />,
    path: "/trigger",
    component: <Trigger />
  },
  {
    label: "用户管理",
    key: "user",
    icon: <UserOutlined />,
    path: "/user",
    component: <UserTable />
  },
  {
    label: "采集记录",
    key: "collect",
    icon: <RadarChartOutlined />,
    path: "/collect",
    component: <Collect />
  },
  {
    label: "文件上传",
    key: "file",
    icon: <FileOutlined />,
    path: "/file",
    component: <FileUpload />
  },
  {
    label: "任务下发",
    key: "task",
    icon: <CodeOutlined />,
    path: "/task",
    component: <UpdateTask />
  }
];

export {routes};
