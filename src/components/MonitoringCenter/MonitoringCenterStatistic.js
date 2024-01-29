import React, {useEffect, useState} from "react";
// import {MailOutlined,AppstoreOutlined} from "@ant-design/icons";
import {Badge, Menu} from "antd";
import {useSafeState} from "ahooks";
import {fetchDeviceList} from "../../libs/request/device";

const monitoringCenterStatisticLabelStyle = {
  color: "var(--font-color)",
  fontWeight: 600
};
export const MonitoringCenterStatistic = (props) => {
  const [a_count, setA_count] = useSafeState(0);
  const [b_count, setB_count] = useSafeState(0);
  const [c_count, setC_count] = useSafeState(0);

  useEffect(()=>{
    fetchDeviceList().then(res=>{
      setA_count(res.length);
      setC_count(res.filter(it=> !it.state).length);
      setB_count(res.filter(it=> it.state).length);
    })
  }, [])
  const items = [
    {
      label: <Badge offset={[10, -4]} count={a_count} style={{color: "#fff"}}><span style={monitoringCenterStatisticLabelStyle}>所有设备</span></Badge>,
      key: "all"
      // icon: <MailOutlined />,
    },
    // {
    //   label: <Badge offset={[10, -4]} count={10} style={{color: "#fff"}}><span style={monitoringCenterStatisticLabelStyle}>报警</span></Badge>,
    //   key: "app",
    //   // icon: <AppstoreOutlined />,
    //   disabled: false
    // },
    {
      label: <Badge offset={[10, -4]} count={b_count} style={{color: "#fff"}}><span style={monitoringCenterStatisticLabelStyle}>在线</span></Badge>,
      key: "online",
      // icon: <AppstoreOutlined />,
      disabled: false
    },
    {
      label: <Badge offset={[10, -4]} count={c_count} style={{color: "#fff"}}><span style={monitoringCenterStatisticLabelStyle}>离线</span></Badge>,
      key: "offline",
      // icon: <AppstoreOutlined />,
      disabled: false
    }

  ];
  const [current, setCurrent] = useState("all");
  const onClick = (e) => {

    setCurrent(e.key);
    props.onChange(e.key);
  };
  return <Menu onClick={onClick}
    selectedKeys={[current]}
    style={{color: "var(--font-color)",width: '100%',display:'flex'}}
    className="device-status-menu"
    mode="horizontal"
    items={items}></Menu>;
};
