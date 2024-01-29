import React, {useEffect} from "react";
import {Select} from "antd";
import {DatePicker} from "antd";
import * as MultipleChart from "../../components/MultipleChart/index";
import {fetchCollect} from "../../libs/request/sensor";
import {useDebounceEffect, useSafeState, useSetState} from "ahooks";
import dayjs from "dayjs";
import {fetchSensorList, fetchSensorType} from "../../libs/request/sensor";

const format = "YYYY-MM-DD HH:mm:ss";
const today = dayjs();
const todayBefore30 = dayjs().subtract(30, "day");

const {RangePicker} = DatePicker;

const SensorInfoTable = (prop) => {
  const [data, setData] = useSafeState([]);
  const [filter, setFilter] = useSetState({end: today, start: todayBefore30});
  const [sensorList, setSensorList] = useSafeState([]);
  const [selectValues, setSelectValues] = useSafeState([]);
  const [sensorType, setSensorType] = useSafeState([]);
  const fetchData = async function() {
    const res = await fetchCollect({
      start: dayjs(filter.start).format(format),
      end: dayjs(filter.end).format(format),
      sensorManageId: selectValues.join(",")
    });
    setData(res.map((it)=>{
      return {
        ...it,
        _name: sensorType?.find(((item)=> item.sensorType === it.sensorType))?.webView
      };

    }));
  };
  const fetchSensors = async function(id) {
    const res = await fetchSensorList({
      deviceManageIds: id
    });
    setSensorList(res?.map((it)=> {
      return {
        label: it.name,
        value: it.id
      };
    }));
    setSelectValues(res?.map((it) => it.id));
  };
  const onChange = (key) => {
    setSelectValues(key);
  };
  const onDateChange = function(event) {
    const [o, s] = event;
    setFilter({
      start: o,
      end: s
    });
  };
  useDebounceEffect(()=>{
    fetchData().catch((e)=> console.warn(e));
  }, [selectValues, sensorType, filter], {wait: 200});
  useEffect(()=>{
    if (prop.daviceManageId) {
      fetchSensors(prop.daviceManageId).catch((e)=> console.warn(e));
    }
  }, [prop.daviceManageId]);
  useEffect(()=>{
    fetchSensorType().then((res)=>{
      setSensorType(res);
    });
  }, []);
  return (
    <React.Fragment>
      <div className = "sensor-info-panel-date-picker">
        <Select
          mode="multiple"
          allowClear
          style={{
            width: "40%"
          }}
          placeholder="传感器"
          value={selectValues}
          onChange={onChange}
          options={sensorList}
          onClear={()=> setSelectValues([])}
        />
        <RangePicker value={[filter.start, filter.end]}
          onChange={onDateChange}
          style={{
            width: "60%",
            float: "right"
          }} showTime placeholder={["开始时间", "结束时间"]} ok={"确定"} />
      </div>
      <div style={{transform: "translateY(30px)"}}><MultipleChart.Line dataSource={data} />
      </div>
    </React.Fragment>
  );
};
export default SensorInfoTable;
