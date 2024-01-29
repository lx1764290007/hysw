import React from "react";
import {Modal,Input} from "antd";
import {useSafeState} from "ahooks";
import {fetchGroupUpdate} from "../../../libs/request/group";
import {useLocalStorage} from "../../../libs/lib"

export function DeviceGroupUpdate(prop){
    const [value, setValue] = useSafeState("");
    const user = useLocalStorage();
    const handleOk = async function (){
        if(value){
            await fetchGroupUpdate({
                id: prop.item?.id,
                name: value,
                updateUserId: user.info?.id
            })
            handleCancel(true);
        }
    }
    const handleCancel = function (refresh=false){

        prop?.onClose?.(refresh, prop.item?.id);
    }
    return (
        <Modal title={"修改分组"+prop.item?.name} open={prop.show} onOk={handleOk} onCancel={()=> handleCancel()}>
            <Input name={"input"} placeholder={"输入分组名称"} onInput={(event)=> setValue(event.target.value)} />
        </Modal>
    )
}
