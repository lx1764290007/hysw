import "./box.css";
import {Space} from "antd";
import React from "react";
export const Box = ({children, withoutBackground}) => (
  <Space direction="vertical" size="middle" style={{"display": "flex"}}>
    <div className={`box-wrapper ${withoutBackground?"box-wrapper-without-background":""}`}>
      {children}
    </div>
  </Space>
);
