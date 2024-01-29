import {Checkbox, Space} from "antd";
import React, {useRef, useState} from "react";
import "./sticky-panel.css";
import {useClickAway} from "ahooks";

export const StickyPanel = (props) => {

  const [state, setState] = useState(false);
  const onChange = (checkedValues) => {
    props?.onChange(checkedValues);
  };
  const onShowHandler = ()=>{
    setState(!state);
  };
  const ref = useRef(null);
  useClickAway(() => {
    setState(false);
  }, ref);
  return (
    <React.Fragment>
      <span ref = {ref} onClick={onShowHandler}>
        {props.children}
      </span>
      {props.children && state && <div className="sticky-panel-wrapper" style={{transform: `translateX(${props.left? "-45%":0})`}}>
        <Space direction="vertical" size="middle" style={{display: "flex"}} onClick={(event)=>event.stopPropagation()}>
          <div className="sticky-panel-list">
            <Checkbox.Group style={{width: "100%"}} onChange={onChange} className="sticky-panel-list-items">
              {
                props.options?.map((item) => {
                  return (
                    <Checkbox value={item.value} key={item.value}><span
                      className="sticky-panel-checkbox-text">{item.label}</span></Checkbox>
                  );
                })
              }
            </Checkbox.Group>
          </div>
        </Space>
      </div>
      }
    </React.Fragment>
  );
};
