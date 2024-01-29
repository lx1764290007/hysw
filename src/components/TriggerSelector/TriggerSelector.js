import React, {useEffect} from "react";
import {Select} from "antd";
import {fetchTriggerList} from "../../libs/request/trigger";
import {useSafeState} from "ahooks";

export const TriggerSelector = function (prop){
    const [list, setList] = useSafeState([]);
    const setGroupList = function (){
        fetchTriggerList().then(res=>{
            const _res = res?.map(it=>{
                return {
                    value: it.id,
                    label: it.name
                }
            })
            setList(_res);
        })
    }

    useEffect(()=>{
        setGroupList()
    }, [])

    return (
        <React.Fragment >
            <Select options={list}
                    style={{width: 120}}
                    placeholder={"选择"}
                    onChange={prop.onChange}
                    value={prop.value}
                    disabled={prop.disabled}></Select>
        </React.Fragment>
    )

}
