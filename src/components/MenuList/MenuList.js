import React, {useEffect} from "react";
import {Menu} from "antd";
import {routes} from "../../router/route";
import {menuVisible} from "../../libs/lib";
import {useLocation, useNavigate} from "react-router-dom";
import {useSafeState} from "ahooks";
import Style from "./menu.module.css";

const items = routes.filter((item)=> menuVisible(item));
export const MenuList = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentLocation, setCurrentLocation] = useSafeState(location.pathname?.replace("/", ""));
  const onClick = (e) => {
    navigate(e.keyPath[0]);
  };
  useEffect(()=>{
    setCurrentLocation(location.pathname?.replace("/", "") || "/");
  }, [currentLocation, location]);
  return (
    <div className={Style.menuListWrapper} onMouseEnter={()=>props.onChange(false)} onMouseLeave={()=>props.onChange(true)}>

      <Menu
        onClick={onClick}
        selectedKeys={[currentLocation]}
        style={{height: "100%"}}
        // defaultSelectedKeys={['1']}
        defaultSelectedKeys={currentLocation}
        mode="inline"

        // theme={theme}
        items={items}
      />
    </div>
  );
};
