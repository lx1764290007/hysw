import React, {useEffect} from "react";
import "./head.css";
import {FullscreenOutlined, UserOutlined, UserSwitchOutlined, PhoneOutlined} from "@ant-design/icons";
import {storeTheme, useFullScreen, useLocalStorage} from "../../libs/lib";
import {id} from "../../App";
import {Button, Popover, Switch} from "antd";
import {useHookstate} from "@hookstate/core";
import {useNavigate} from "react-router-dom";
import {useInterval, useSafeState} from "ahooks";
import {StickyPanel} from "../StickyPanel/StickyPanel";
import Style from "../../views/BigSur/big-sur.module.css";
import {logoutHandle} from "../../libs/request/login";
import {QRCodeSVG} from "qrcode.react";
import {fetchWechatCode} from "../../libs/request/user";
import {LoadingComponent, STATUS} from "../LoadingAndRetry/Loading";

const BigLogo = function(prop) {
  return (
    <div className={prop.theme.get()==="dark"? Style.bigsurLogo:Style.bigsurLogo2}>
      <h2>水务管理系统大屏</h2>
    </div>
  );
};
// const SOCKET = new WebSocket(SOCKET_ALARM_URL);
const PopoverUserContent = function() {
  const [loading, setLoading] = useSafeState(false);
  const [url, setUrl] = useSafeState(null);
  const navigate = useNavigate();
  const localData = useLocalStorage();
  const [data] = useSafeState(localData.info);


  useEffect(()=>{
    setLoading(true);
    fetchWechatCode().then((res)=>{
      setUrl( `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${res.appId}&redirect_uri=https%3A%2F%2Fitao-tech.com%2Fbind.html&response_type=code&scope=snsapi_base&state=${data.id}#wechat_redirect`);
    }).finally(()=>{
      setLoading(false);
    });
  }, []);
  const onLogout = async function() {
    await logoutHandle();
    navigate("/login");
  };
  return (
    <div className="popover-user-content-wrapper">
      <div className = "popover-user-content-right">
        <LoadingComponent state={loading? STATUS.LOADING:STATUS.SUCCESS}>
          <QRCodeSVG value={url} includeMargin size={90} level="L" />
        </LoadingComponent>
        <p className={"base-font-color"}>微信扫一扫-绑定</p>
      </div>
      <div className="popover-user-content-title base-item-title">
        <span className="popover-user-content-item-left base-font-color"><UserOutlined/></span>
        <span className="popover-user-content-item-right base-font-stronger base-font-color">
          {(data?.loginName || "-") + `@${data.name}`}
        </span>
      </div>
      <div className="popover-user-content-title base-item-title">
        <span className="popover-user-content-item-left base-font-color"><PhoneOutlined /></span>
        <span className="popover-user-content-item-right base-font-stronger base-font-color">
          {data?.phone && <span className="base-font-stronger base-font-color">
            {data?.phone?.substring?.(0, 3) + "****"+ data?.phone?.substring?.(7)}
          </span>}
        </span>
      </div>
      <div className="popover-user-content-item">
        <span className="popover-user-content-item-left">用户权限：</span>
        <span className="popover-user-content-item-right base-font-stronger base-font-color">
          {data?.dataType}
        </span>
      </div>
      <div className="popover-user-footer">
        <Button type="default" danger size="small" onClick={onLogout}><UserSwitchOutlined/>退出登录</Button>
      </div>
    </div>
  );
};
// eslint-disable-next-line require-jsdoc
export function HeaderBar(props) {
  const [fullScreenState, setFullScreen] = useFullScreen();
  const {theme} = useHookstate(storeTheme);
  const [isLoginPath, setIsLoginPath] = useSafeState(/login/g.test(window.location.pathname));
  useInterval(() => {
    const isLogin = /login/g.test(window.location.pathname);
    setIsLoginPath(isLogin);
  }, 1000);

  const onFullScreenClickHandle = function() {
    setFullScreen(document.querySelector(`#${id}`), true);
  };
  const onThemeChangeHandle = function() {
    theme.set(Object.is(theme.get(), "dark") ? "light" : "dark");
    window.localStorage.setItem("theme", theme.get());
  };

  return (
    <div className="big-sur-header-bg base-item-title base-theme-bg">
      {fullScreenState && <StickyPanel>
        <BigLogo theme={theme} />
      </StickyPanel>}
      {!fullScreenState && <>
        <div className="big-sur-header-title ">水务后台管理系统</div>
        {!isLoginPath && <div className="big-sur-header-tools base-font-color">
          {
            !props.hideUser && <Popover content={<PopoverUserContent/>} trigger="hover">
              <UserOutlined className="base-color-clickable"/>
            </Popover>}
          {/* <Badge count={5} dot>*/}
          {/*  <AlertOutlined style={{fontSize: 20}} onClick={onAlertClick} title={"消息通知"}*/}
          {/*    className="base-color-clickable"/>*/}
          {/* </Badge>*/}
          <Switch checkedChildren={"亮色"} title="主题替换" defaultChecked={theme.get()==="light"} unCheckedChildren={"深色"}
            onChange={onThemeChangeHandle}/>
          <FullscreenOutlined title="全屏"
            className="base-color-clickable"
            onClick={onFullScreenClickHandle}/>
        </div>}
      </>}
    </div>
  );
}
