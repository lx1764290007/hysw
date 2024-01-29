import React from "react";
import {Space, Table, Tag, Button} from "antd";
import Style from "./big-sur.module.css";

const {Column} = Table;
const data = [
  {
    key: "1",
    firstName: "2023-12-11",
    lastName: 6,
    age: 21,
    address: 1,
    tags: 0
  },
  {
    key: "2",
    firstName: "2023-12-10",
    lastName: 2,
    age: 0,
    address: 1,
    tags: 1
  },
  {
    key: "3",
    firstName: "2023-12-09",
    lastName: 2,
    age: 2,
    address: 1,
    tags: 2
  }
];
const BigSurTable = () => (
  <div className={`${Style["bigsur-table"]} base-scroll-bar`}>
    <Table dataSource={data} align={"center"} pagination={false}>

      <Column title="日期" dataIndex="firstName" key="firstName" align={"center"} />

      <Column title="设备异常数量" dataIndex="age" key="age" align={"center"}  render={(text) => (
          <span style={{color: text>0? "red":"#333"}}>{text}</span>
      )} />
      <Column title="报警数量" align={"center"} dataIndex="address" key="address" render={(text) => (
          <span style={{color: text>0? "red":"#333"}}>{text}</span>
      )} />
      <Column title="已处理数量" dataIndex="tags" key="tags" align={"center"} render={(text) => (
          <span style={{color: text>0? "green":"#333"}}>{text}</span>
      )} />

    </Table>
  </div>
);
export default BigSurTable;
