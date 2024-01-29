import React from "react";
import {Space} from "antd";
import "./card.css";
import {StickyPanel} from "../StickyPanel/StickyPanel";
import {Button2} from "./Button";

const Panel = ({title, options, left, children, button, right, box}) => {
  const onChangeHandle = function(values) {
    console.log(values);
  };

  return (
    <Space direction="vertical" size="middle" style={{"display": "flex"}}>
      <div className="card-wrapper" style={{"border": "1px solid #409ea1"}}>
        <div className="card-panel" style={{"backgroundImage": "none"}}>
          <div className={`card-title ${box? "card-title-without-color":""}`}>
            <span className="card-title-left" title={title}>{title}</span>
            <span className="card-title-right">
              {button && <StickyPanel options={options} onChange={onChangeHandle} left={left}>
                <Button2 />
              </StickyPanel>}
              {right && right}
            </span>
          </div>
          <div className="card-content">
            {children}
          </div>
        </div>
      </div>
    </Space>
  );
};

export default Panel;
