import React from "react";
import {Space} from "antd";
import "./card.css";
// import {StickyPanel} from "../StickyPanel/StickyPanel";
import {Button2} from "./Button";
import {useSafeState} from "ahooks";

const Card = (props) => {
  const [state, setState] = useSafeState(false);
  const onChangeHandle = function(values) {
    setState(!state);
  };

  return (
    <Space direction="vertical" size="middle" style={{"display": "flex"}}>
      <div className="card-wrapper">
        <div className="card-panel">
          <div className="card-title">
            {/* eslint-disable-next-line react/prop-types */}
            <span className="card-title-left"
              title={props.title}>{props.title}
            </span>
            <span className="card-title-right">
              {/* eslint-disable-next-line react/prop-types */}
              {/* {props["button"] &&*/}
              {/*    <StickyPanel options={props.options}*/}
              {/*      onChange={onChangeHandle}*/}
              {/*      left={props.left}>*/}
              {/*      <Button2 />*/}
              {/*    </StickyPanel>}*/}
              {state && props.right}
              {props.right && <Button2 onClick={onChangeHandle} />}
            </span>
          </div>
          <div className="card-content" style={{height: props.height}}>
            {/* eslint-disable-next-line react/prop-types */}
            {props.children}
          </div>
        </div>

      </div>
    </Space>
  );
};

export default Card;
