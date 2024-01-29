import * as React from "react";
import {Cell} from "../../components/Cell/Cell";
import "./scroll-news.css";
import {CloudUploadOutlined} from "@ant-design/icons";
import {useMount, useSafeState} from "ahooks";
import {Empty, Tag} from "antd";
import {SOCKET_COLLECT_URL} from "../../libs/request/socket";
import {useEffect} from "react";
import {fetchSensorType} from "../../libs/request/sensor";
import {storeNews} from "../../libs/lib";
import {useHookstate} from "@hookstate/core";
import dayjs from "dayjs";
import {fetchDeviceList} from "../../libs/request/device";

const cellStyle = {
  borderBottom: "1px solid rgba(26,28,159,0.5)"
};


let SOCKET = new WebSocket(SOCKET_COLLECT_URL);


export const ScrollNews = function(prop) {
  const [animation, setAnimation] = useSafeState(true);
  const [size, setSize] = useSafeState(8);
  const [sensorList, setSensorList] = useSafeState([]);
  const {k, data, record} = useHookstate(storeNews);
  const [deviceList, setDeviceList] = useSafeState([]);
  useEffect(()=>{
    fetchDeviceList().then((r) => setDeviceList(r));
  }, []);
  const onAnimationEnd = function(event) {
    setAnimation(false);
    record.set((value)=> [...value, data.get()[k.get()]?.id]);
    k.set((value)=> value+1);
    setTimeout(() => {
      setAnimation(true);
    }, 3000);
    if (data.get().length > 50) {
      data.set((value)=> value.slice(record.get().length));
      record.set(()=>[]);
      k.set((value)=> 0);
    }
  };
  const initSocket = function(socket) {
    socket.onmessage = function(latestMessage) {
      const _data = data.get();
      if (latestMessage && latestMessage.data) {
        const message = JSON.parse(latestMessage.data);
        const target = _data.find((it)=> it.id === message.id);
        if (!target) {
          data.set((value)=> [...value, message]);
        }
      }
    };
    socket.onerror = function() {
      socket.close(1000);
    };
    socket.onopen= function() {
      console.log("开始连接");
    };
    socket.onclose = function() {
      console.log("连接关闭");
      setTimeout(()=>{
        initSocket(new WebSocket(SOCKET_COLLECT_URL));
      }, 10000);
    };
  };
  useMount(() => {
    fetchSensorType().then((res)=>{
      setSensorList(res);
    });
    initSocket(SOCKET);
  });
  useEffect(()=>{
    if (prop.size) {
      setSize(prop.size?.height/2.6/37);
    }
  }, [prop.size]);
  return (
    <div className={"screen-box-container"} id={"screen-box-container_0254"}>
      <div onAnimationEnd={onAnimationEnd}
        className={`scroll-news-item ${animation && data.get()?.length - record.get().length >=size-1 ? "scroll-news-animate" : ""}`}>
        {data.get()?.map?.((k, i) => {
          return (<div key={i}>{ record.get().includes(k.id) === false &&
            <Cell key={i} left={
              <span className={"scroll-news-item-name base-color-sensor"}>
                <CloudUploadOutlined style={{marginRight: 6}} />
                {deviceList.find((it)=> it.id === k.deviceManageId)?.name} -
                {sensorList.find((it)=> it.sensorType === k.sensorType)?.webView}
              </span>
            }
            useIcon
            right={<Tag bordered color={"#487aab"}>{k.analysisValue + k.unit}</Tag>}
            style={cellStyle} footer={dayjs(k?.createTime).format("YYYY-MM-DD HH:mm:ss")}/>}</div>
          );
        })}
      </div>
      {data.get()?.length<1 && <Empty style={{marginTop: 50}} description={"没有数据"} /> }
    </div>
  );
};
