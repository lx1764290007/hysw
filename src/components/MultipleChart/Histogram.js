import {Chart, getTheme, Interval, Tooltip} from "bizcharts";
import {
  useDebounceEffect,
  useMount,
  useSafeState
} from "ahooks";
import React, {useState} from "react";
import {LoadingComponent, STATUS} from "../LoadingAndRetry/Loading";

const data = [
  {year: "1951 年", sales: 0},
  {year: "1952 年", sales: 52},
  {year: "1956 年", sales: 61},
  {year: "1957 年", sales: 45},
  {year: "1958 年", sales: 48},
  {year: "1959 年", sales: 38},
  {year: "1960 年", sales: 38},
  {year: "1962 年", sales: 38}
];


const Histogram = (props) => {
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
  useMount(()=>{
    setDataSource(data);
  });

  return ( <LoadingComponent state={draw? STATUS.SUCCESS:STATUS.LOADING}><div className = "screen-box-container"> {draw && <Chart data={dataSource} autoFit>
    <Interval position="year*sales" style={{lineWidth: 4, stroke: getTheme().colors10[0]}}/>
    <Tooltip shared/>
  </Chart>}</div></LoadingComponent> );
};
export default Histogram;
