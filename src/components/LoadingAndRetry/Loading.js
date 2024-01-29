import "./loading.css";
import {
  CheckCircleOutlined,
  FileExclamationOutlined,
  Loading3QuartersOutlined} from "@ant-design/icons";
import React from "react";

export const STATUS = {
  "LOADING": 1,
  "FAILED": 2,
  "SUCCESS": 3
};
const fontIcon = {
  "color": "#4da94c", "fontSize": "large",
  "marginRight": "5px", "fontWeight": "600"
};


// eslint-disable-next-line valid-jsdoc
/**
 * @return {JSX.Element}
 * @constructor
 * @params props  onRetry:()=>void, state:STATUS
 */
export function LoadingComponent(props) {
  const handleRetry = function() {
    props.onRetry?.();
  };
  return (
    <div className="loading-wrapper">
      <div style={{"position": "relative"}}>{props.children}
        {props.state && props.state !== STATUS.SUCCESS &&
                    <div className="loading-zone">
                      {props.state === STATUS.LOADING &&
                            <Loading3QuartersOutlined spin style={fontIcon}/>}
                      {props.state === STATUS.FAILED &&
                            <span><FileExclamationOutlined style={fontIcon}/>
                              <span className="loading-text">请求失败</span>
                            </span>}
                      {props.state === STATUS.SUCCESS &&
                            <CheckCircleOutlined style={fontIcon}/>}
                      {props.state === STATUS.FAILED &&
                            <button className="loading-retry-btn"
                              onClick={handleRetry}>重试</button>}

                    </div>}
      </div>
    </div>
  );
}
