import {Col, Row, Space, Carousel, DatePicker} from "antd";
import React from "react";
import {Card} from "../../components/Card/index";
// import {Box} from "../../components/Box/Box"
import Style from "./big-sur.module.css";
import {Map} from "../../components/BigSurMap/Map";
import * as MultipleChart from "../../components/MultipleChart/index";
import {ScrollNews} from "./ScrollNews";
import {useDebounce, useMount, useSafeState, useSetState} from "ahooks";
import {fetchSensorType} from "../../libs/request/sensor";
import dayjs from "dayjs";
import {fetchDeviceList} from "../../libs/request/device";
import {NotifycationNews} from "./NotifycationNews";
import {fetchAlarmCount} from "../../libs/request/sensor";
import {TRIGGER_ALARM_GRADE} from "../../libs/static";

const format = "YYYY-MM-DD HH:mm:ss";
const today = dayjs().endOf("date");
const todayBefore30 = dayjs().startOf("date").subtract(30, "day");
const BigSur = () => {
  const [size, setSize] = useSafeState({});
  const debouncedValue = useDebounce(size, {wait: 300});
  const [filter, setFilter] = useSetState({end: today, start: todayBefore30});
  const [sensorTypeList, setSensorTypeList] = useSafeState([]);
  const [deviceList, setDeviceList] = useSafeState([]);
  const [active, steActive] = useSafeState(0);
  const [alarmCount, setAlarmCount] = useSafeState(undefined);
  useMount(()=>{
    fetchSensorType().then((res)=>{
      setSensorTypeList(res);
      fetchDeviceList().then((r)=>{
        setDeviceList(r);
      });
    });
    fetchAlarmCount().then((res)=>{
      setAlarmCount(res);
    });
  });
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
  const onChange = function(event) {
    if (deviceList[event]?.id === undefined || event===active) return;
    steActive(event);
  };
  const onDateChange = function(event) {
    setFilter({
      start: event[0],
      end: event[1]
    });
  };
  useMount(()=>{
    resizeObserver.observe(document.querySelector("#app-page1"));
  });
  return (
    <React.Fragment>
      <div className={Style.bigSurWrapper} id={"app-page1"}>
        <Row gutter={16}>
          <Col span={7}>
            <Space
              direction="vertical"
              size="middle"
              style={{
                "display": "flex"
              }}>
              <Card title={`设备-${deviceList[active]?.name || "..."}-采集记录`} right={<DatePicker.RangePicker defaultValue={[todayBefore30, today]} size={"small"} onChange={onDateChange} format={format} style={{width: 240}} />}>
                <Carousel afterChange={onChange} autoplay autoplaySpeed={10000}>
                  {
                    deviceList.map((item)=>{
                      return <MultipleChart.Line sensorTypeList={sensorTypeList} key={item.id} filter={filter} size={debouncedValue} deviceId={item.id} />;
                    })
                  }
                </Carousel>
              </Card>
              <Card title="设备统计">
                <MultipleChart.Pie dataSource={sensorTypeList} size={debouncedValue} />
              </Card>
            </Space>
          </Col>
          <Col span={10}>
            <Card title="设备地图">
              <Map />
            </Card>
          </Col>
          <Col span={7}>
            <Space
              direction="vertical"
              size="middle"
              style={{
                display: "flex"
              }}>
              <Card title="传感器实时采集数据">
                <ScrollNews size={debouncedValue} />
              </Card>
              <Card title={"告警统计"}>
                <div className={Style?.cardWrapper}>
                  {/* eslint-disable-next-line react/jsx-key */}
                  {TRIGGER_ALARM_GRADE?.map?.((item)=> <div className={Style.cardItem}>
                    <span className={Style.cardItemTitle} style={{color: item.color}}>{item.label}：</span>
                    <span>{alarmCount?.find?.((it)=> it.alarmGrade === item.value)?.count}</span>
                  </div>)}
                </div>
              </Card>
              <Card title="设备告警实时监控" >
                <NotifycationNews size={debouncedValue} />
              </Card>
            </Space>
          </Col>
        </Row>

      </div>
    </React.Fragment>
  );
};

export {BigSur};
