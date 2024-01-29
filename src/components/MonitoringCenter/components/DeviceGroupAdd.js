import React from "react";
import {Modal, Input} from "antd";
import {useSafeState} from "ahooks";
import {fetchGroupAdd} from "../../../libs/request/group";
import {useLocalStorage} from "../../../libs/lib";

export function DeviceGroupAdd(prop) {
  const [value, setValue] = useSafeState("");
  const user = useLocalStorage().info;
  const handleOk = async function() {
    if (value) {
      await fetchGroupAdd({
        createUserId: user.id,
        name: value
      });
      handleCancel(true);
    }
  };
  const handleCancel = function(refresh=false) {
    prop?.onClose?.(refresh);
  };
  return (
    <Modal title="添加点位" open={prop.show} onOk={handleOk} onCancel={()=>handleCancel(false)}>
      <Input name={"input"} placeholder={"输入名称"} onInput={(event)=> setValue(event.target.value)} />
    </Modal>
  );
}
