import React, {useEffect} from "react";
import {IconFont} from "../Icon/IconFont";
import "./cell.css";
import {AlertOutlined} from "@ant-design/icons";
import {getAlertColor, getType} from "../../libs/static";
import {Popover} from "antd";
import {useSafeState} from "ahooks";


/**
 * @param {{active:boolean,useIcon:boolean,right:JSX.Element,left:JSX.Element,footer:JSX.Element}} props  - 激活状态的样式
 * @return {JSX.Element}
 * @constructor
 */
export function Cell(props) {
  const [color, setColor] = useSafeState();
  const [text, setText] = useSafeState();
  useEffect(()=>{
    if (props.state !== undefined) {
      setColor(getAlertColor(props.state));
      setText(getType(props.state));
    }
  }, [props.state]);
  return (
    <div className={`cell-wrapper ${props.active ? "cell-active" : ""}`} style={props.style}>
      {props.status && <span className="cell-head-status">
        <Popover content={"警告状态"} ><AlertOutlined style={{fontSize: 24, color: color}}/><span style={{fontSize: "small", color: color}}>{text}</span></Popover>

      </span>}
      <div className="cell-wrapper-right">
        <div className="cell-head">
          <div className="cell-head-left">
            {props.icon && props.useIcon && <span className="cell-wrapper-left">
              <IconFont type={props.icon}></IconFont>
              {props.icon && !props.useIcon && props.icon}
            </span>}
            {props.left}
          </div>

          {props.right && <div className="cell-head-right">{props.right}</div>}

        </div>
        {props.footer && <div className="cell-footer base-scroll-bar" style={{paddingLeft: props.useIcon? "1.71em":0}} key={Math.random().toFixed(2)}>
          {props.footer}
        </div>}
      </div>

    </div>
  );
}


