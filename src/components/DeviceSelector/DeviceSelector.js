import React, {useEffect} from "react";
import {Select} from "antd";
import {fetchDeviceList} from "../../libs/request/device";
import {useSafeState} from "ahooks";

export const DeviceSelector = function(prop) {
  const [list, setList] = useSafeState([]);
  const setDeviceList = function(id) {
    fetchDeviceList({
      deviceGroupId: id
    }).then((res)=>{
      const _res = res?.map((it)=>{
        return {
          value: it.id,
          label: it.name
        };
      });
      setList(_res);
    });
  };
  useEffect(()=>{
    if (prop.groupId || prop.groupId === null) {
      setDeviceList(prop.groupId);
    }
  }, [prop.groupId]);

  return (
    <React.Fragment >
      <Select style={{width: 120}}
        options={list}
        onChange={prop.onChange}
        value={prop.value}
        defaultValue={prop.value}
        placeholder={"选择"}
        disabled={prop.disabled}></Select>
    </React.Fragment>
  );

};
