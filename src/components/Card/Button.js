import {Button, Space} from "antd";
import React from "react";
import {SwapOutlined} from "@ant-design/icons";
export const Button2 = (prop) => (
  <Space wrap>
    <Button size="small" type="text" onClick={prop.onClick} style={{color: "var(--font-color)", position: "relative"}}><SwapOutlined /></Button>
  </Space>
);
