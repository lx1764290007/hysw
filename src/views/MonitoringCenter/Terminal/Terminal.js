import React, {useEffect} from "react";
import "./terminal.css";
import {useSafeState} from "ahooks";
import {LoadingComponent, STATUS} from "../../../components/LoadingAndRetry/Loading";

const name = "$设备: "; const ENTER_KEY_CODE = 13;

export const Terminal = () => {
  const [value, setValue] = useSafeState(name);
  const [inputState, setInputState] = useSafeState(STATUS.SUCCESS);
  const onChange = (target) => {
    if (target.value.length <= name.length) {
      setValue(name);
    } else {
      setValue(target.value);
    }
  };
  const handleKeyPress = (target)=>{
    if (target.keyCode === ENTER_KEY_CODE) {
      setInputState(STATUS.LOADING);
    }
  };
  useEffect(()=>{
    if (inputState === STATUS.LOADING) {
      setTimeout(()=>{
        setInputState(STATUS.SUCCESS);
      }, 2000);
    }
  }, [inputState]);
  return (
    <div className="terminal-wrapper">
      <LoadingComponent state={inputState}>
        <textarea
          wrap={"soft"}
          autoFocus={true}
          readOnly={inputState === STATUS.LOADING}
          className="terminal-input base-scroll-bar"
          value={value}
          onKeyUp={handleKeyPress}
          onInput={(event) => onChange(event.target)}
          placeholder={"输入"}/>
      </LoadingComponent>
    </div>
  );
};


