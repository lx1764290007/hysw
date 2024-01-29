import * as React from "react";
import {memo, useEffect} from "react";
import {Layer} from "konva/lib/Layer";
import {Stage} from "konva/lib/Stage";
import {useMount, useSafeState} from "ahooks";
import "./map.css";
import Konva from "konva";
import {DeviceIconSingle, DeviceIconContent, dataSource} from "../Icon/DeviceIcons";
import {deviceState} from "../../libs/lib";
import {useHookstate} from "@hookstate/core";
import {LoadingComponent, STATUS} from "../LoadingAndRetry/Loading";

const IMG_URL = require("./map.png");
const DeviceIconSingleMemo = memo(DeviceIconSingle);
const MAP_WIDTH = 470; const MAP_HEIGHT = 700;
let icon;
/**
 * @param  {any} props - 透传
 * @return {JSX.Element}
 * @constructor
 */
export function MyMap(props) {
  const hookState = useHookstate(deviceState);
  const [randomId] = useSafeState(`_my_map_${Math.random().toFixed(2) + String(Date.now())}`);
  const [loading, setLoading] = useSafeState(STATUS.LOADING);
  const setDeviceMark = function(event, target) {
    const {evt} = event;
    const {offsetX, offsetY} = evt;
    const data = {
      name: icon || target,
      offsetX: offsetX,
      offsetY: offsetY
    };
    hookState.set((p)=> props.single? [data] : [
      ...p,
      data
    ]);
    props.onSelect && props.onSelect({offsetX, offsetY, icon: data["name"]});
  };
  const init = function(img) {
    if (document.getElementById(randomId)===null) {
      setTimeout(init, 1000);
      return;
    }
    const _stage = new Stage({
      container: randomId,
      width: MAP_WIDTH,
      height: MAP_HEIGHT
    });
    const _layer = new Layer({
      clearBeforeDraw: true,
      x: 0,
      y: 0,
      visible: true,
      id: "abc",
      listening: true,
      scale: {x: 1, y: 1}
    });
    _layer.on("click", (evt)=> setDeviceMark(evt, props.icon || dataSource[0].value));
    const image = new Konva.Image({
      x: 0,
      y: 0,
      offsetX: 0,
      offsetY: 0,
      image: img,
      width: MAP_WIDTH,
      height: MAP_HEIGHT
    });
    _layer?.add?.(image);
    _layer?.draw?.();
    _stage.add(_layer);
    setLoading(STATUS.SUCCESS);
  };

  // useEffect(() => {
  //   startPainter();
  // }, [debouncedValue]);
  useMount(()=>{
    initImage();
  });
  // useEffect(()=>{
  //   deviceState.set((p)=> p.map((it)=> {
  //     return {
  //       ...it,
  //       scale: {
  //         x: it.offsetX,
  //         y: props.size?.height / it.originHeight
  //       }
  //     };
  //   }));
  // }, [props.size]);
  const initImage = function() {
    const imageObj = new Image();
    imageObj.onload = function() {
      init(imageObj);
    };
    imageObj.onerror = function() {
      setTimeout(initImage, 1000);
    };
    imageObj.src = IMG_URL;
  };
  useEffect(()=>{
    if (props.position && props.position.length>0) {
      hookState.set((p)=> props.position);
    } else {
      hookState.set((p)=> []);
    }
  }, [props.position]);

  useEffect(()=>{
    icon = props.icon;
  }, [props.icon]);

  return (
    <div className={"map-container"} style={{pointerEvents: props.disabled? "none":"auto"}}>
      <LoadingComponent state={loading}><div id={randomId} style={{pointerEvents: props.readOnly? "none":"auto"}}></div></LoadingComponent>
      {hookState.get().map?.((it, _i)=>{
        return <DeviceIconContent deviceId={it?.id} hideBox={props.single} key={_i} ><DeviceIconSingleMemo dataSource={it} /></DeviceIconContent>;
      })}
    </div>
  );
}
