import React, {useEffect} from "react";
import {MyMap} from "./MyMap";

import "./map.css";
import {useMount, useSafeState} from "ahooks";
import {fetchDeviceList} from "../../libs/request/device";

export const Map = () => {
  const [size, setSize] = useSafeState({width: 0, height: 0});
  const [list, setList] = useSafeState([]);
  useEffect(()=>{
    fetchDeviceList().then((res=[])=>{
      setList(res.filter((item)=>{
        return !isNaN(item.longitude) && !isNaN(item.latitude);
      }).map((it)=>{
        return {
          offsetX: it.longitude,
          offsetY: it.latitude,
          icon: it.iconData,
          id: it.id
        };
      }));
    });
  }, []);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.contentBoxSize) {
        if (entry.contentBoxSize[0]) {
          const {inlineSize, blockSize} = entry.contentBoxSize[0];
          setSize({
            width: inlineSize,
            height: blockSize
          });
        }
      }
    }
  });
  useMount(()=>{
    resizeObserver.observe(document.querySelector("#a-map"));
  });
  return (
    <div id="a-map" >
      <MyMap readOnly position={list} size={size} />
    </div>
  );
};
