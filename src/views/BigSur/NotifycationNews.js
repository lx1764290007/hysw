import * as React from "react";
import {Cell} from "../../components/Cell/Cell";
import "./scroll-news.css";
import {BellOutlined} from "@ant-design/icons";
import {useMount, useSafeState} from "ahooks";
import {Empty, Tag} from "antd";
import {SOCKET_ALARM_URL} from "../../libs/request/socket";
import {useEffect} from "react";
import {storeNotificationNews} from "../../libs/lib";
import {useHookstate} from "@hookstate/core";
import dayjs from "dayjs";
import {fetchDeviceList} from "../../libs/request/device";
import {TRIGGER_ALARM_GRADE} from "../../libs/static";

const cellStyle = {
  borderBottom: "1px solid rgba(26,28,159,0.5)"
};


let SOCKET = new WebSocket(SOCKET_ALARM_URL);

const MyTag = function(prop) {
  const _target = TRIGGER_ALARM_GRADE.find((it)=> it.value === prop.value) || {};
  return <><span className={"base-color-clickable"}>紧急程度</span> <span style={{color: _target.color, fontWeight: 600}}>{_target.label}</span></>;
};

export const NotifycationNews = function(prop) {
  const [animation, setAnimation] = useSafeState(true);
  const [size, setSize] = useSafeState(8);
  const [deviceList, setDeviceList] = useSafeState([]);
  const {k, data, record} = useHookstate(storeNotificationNews);
  const onAnimationEnd = function(event) {
    setAnimation(false);
    record.set((value)=> [...value, data.get()[k.get()]?.id]);
    k.set((value)=> value+1);
    setTimeout(() => {
      setAnimation(true);
    }, 3000);
    if (data.get().length > 100) {
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
        initSocket(new WebSocket(SOCKET_ALARM_URL));
      }, 10000);
    };
  };
  useMount(() => {
    fetchDeviceList().then((res)=>{
      setDeviceList(res);
    });
    initSocket(SOCKET);
  });
  useEffect(()=>{
    if (prop.size) {
      setSize(prop.size?.height/2.6/37);
    }
  }, [prop.size]);
  return (
    <div className={"screen-box-container2"} id={"screen-box-container_0254"}>
      <div onAnimationEnd={onAnimationEnd}
        className={`scroll-news-item ${animation && data.get()?.length - record.get().length >=size-1 ? "scroll-news-animate" : ""}`}>
        {data.get()?.map?.((k, i) => {
          return (<div key={i}>{ record.get().includes(k.id) === false &&
                            <Cell key={i} left={
                              <span className={"scroll-news-item-name base-color-sensor"}>
                                <BellOutlined style={{marginRight: 6}} />
                                {deviceList.find((it)=> it.id === k.deviceManageId)?.name}
                              </span>
                            }
                            useIcon
                            right={<Tag bordered color={"#d94f71"}>{k.triggerRemark}</Tag>}
                            style={cellStyle} footer={
                              <div style={{display: "flex", justifyContent: "space-between", width: "95%"}}>
                                <span>{dayjs(k?.createTime).format("YYYY-MM-DD HH:mm:ss")}</span>
                                <span><MyTag value={k.alarmGrade} /></span>
                              </div>
                            }/>}</div>
          );
        })}
      </div>
      {data.get()?.length<1 && <Empty style={{marginTop: 50}} description={"没有数据"} /> }
    </div>
  );
};
