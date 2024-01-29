import React, {useEffect} from "react";
import "./alert.css";
import {Button} from "antd";
import {useHookstate} from "@hookstate/core";
import {storeTheme} from "../../libs/lib";
import {WarningOutlined} from "@ant-design/icons";
export const Alert = ({content, title, onOk})=>{
  const _theme = useHookstate(storeTheme);
  const [state, setState] = React.useState(false);
  const onConfirmHandler = function() {
    onOk?.();
  };
  useEffect(()=>{
    setState(true);
  }, []);
  return (
    <React.Fragment >
      <div className = {"alert-wrapper"}>
        <div className = {`alert-container alert-${_theme.theme.get()}-theme ${state? "alert-transition":""}`}>
          <div className={`alert-title alert-title-${_theme.theme.get()}-theme`}>
            <div className="alert-title-text">{title}</div>
            <div className="alert-title-icon"><WarningOutlined /></div>
          </div>
          <span className = "title-diver"></span>
          <div className = {`alert-content alert-content-${_theme.theme.get()}-theme`}>
            {content}
          </div>
          <div className="alert-footer">
            <Button style={{backgroundColor: "#409ea1", color: "#fff"}}
              type={"primary"} size={"small"}
              onClick={onConfirmHandler}
              shape>确定</Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
