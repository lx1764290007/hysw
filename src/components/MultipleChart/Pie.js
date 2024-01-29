import React, {useEffect, useState} from "react";
import {
  Chart,
  Interval,
  Tooltip,
  Axis,
  Coordinate,
  Interaction,
  getTheme
} from "bizcharts";
import {useDebounceEffect, useSafeState} from "ahooks";
import {LoadingComponent, STATUS} from "../LoadingAndRetry/Loading";
import {fetchTypeCount} from "../../libs/request/sensor";

const Pie = (props) => {
  const cols = {
    percent: {
      formatter: (val) => {
        val = val * 100 + "%";
        return val;
      }
    }
  };
  const [dataSource, setDataSource] = useSafeState([]);
  const [draw, setDraw] = useState(false);

  useDebounceEffect(()=>{
    setDraw(false);
  }, [props.size], {leading: false, wait: 200});
  useDebounceEffect(()=>{
    if (draw===false) {
      setDraw(true);
    }
  }, [draw], {leading: false, wait: 200});

  useEffect(()=>{
    if (props.dataSource) {
      fetchTypeCount().then((res)=>{
        const _dataSource = res.map((item)=>{
          return {
            item: props.dataSource.find((it)=> it.sensorType === item.sensorType)?.webView,
            count: item.count,
            percent: item.count / (res.reduce((accumulator, currentValue) => accumulator + currentValue.count, 0))
          };
        });
        setDataSource(_dataSource);
        console.log(_dataSource);
      });
    }
  }, [props.dataSource]);
  return (
    <LoadingComponent state={draw? STATUS.SUCCESS:STATUS.LOADING}>
      <div className={"screen-box-container"}>
        {draw &&
      <Chart data={dataSource} scale={cols} autoFit
        // onIntervalClick={(e) => {
        //   console.log(e.target.cfg.element.getStates());// 如果是选中，值为['selected'];取消选中，值为[]
        // }}
        // onGetG2Instance={(c)=>{
        //   console.log(c.getXY(data[0]));
        // }}
      >
        <Coordinate type="theta" radius={0.75} />
        <Tooltip showTitle={false} />
        <Axis visible={false} />
        <Interval
          position="percent"
          adjust="stack"
          color="item"
          style={{
            lineWidth: 1,
            stroke: "#fff"
          }}
          label={["count", {
          // label 太长自动截断
            layout: {type: "limit-in-plot", cfg: {action: "ellipsis"}},
            content: (data) => {
              return `${data.item}: ${data.count}`;
            }
          }]}
          state={{
            selected: {
              style: (t) => {
                const res = getTheme().geometries.interval.rect.selected.style(t);
                return {...res, fill: "red"};
              }
            }
          }}
        />
        <Interaction type='element-single-selected' />
      </Chart>
        }
      </div>
    </LoadingComponent>
  );
};
export default Pie;


