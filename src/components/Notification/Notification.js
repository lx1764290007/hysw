import React from "react";
import {List} from "antd";
import {AlertOutlined} from "@ant-design/icons";
import {storeNews} from "../../libs/lib";
import {useHookstate} from "@hookstate/core";
// eslint-disable-next-line require-jsdoc
export function Notification() {
  const {data} = useHookstate(storeNews);
  return <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item, index) => (
      <List.Item>
        <List.Item.Meta
          title={item.title}
          avatar={<AlertOutlined />}
          description={item.description}
          detail={index}
        />
      </List.Item>
    )}
  />;
}
