import {createFromIconfontCN} from "@ant-design/icons";
import {iconFontUrl} from "../../libs/lib";
import React from "react";

const MyIcon = createFromIconfontCN({
  scriptUrl: iconFontUrl // 在 iconfont.cn 上生成
});

export const IconFont = (props) => (
  <span title={props.title}>
    <MyIcon type={props.type} className={props.className} style={props.style}></MyIcon>
  </span>
);
