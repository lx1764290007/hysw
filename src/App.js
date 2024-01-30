import "./App.css";
import React, {useEffect, useState} from "react";
import {Route, Routes, useNavigate} from "react-router-dom";
import {routes} from "./router/route";
import {App as AntdApp, ConfigProvider, Layout, message, theme} from "antd";
import {HeaderBar} from "./components/HeaderBar/HeaderBar";
import {MenuList} from "./components/MenuList/MenuList";
import {useHookstate} from "@hookstate/core";
import {storeTheme, useLocalStorage, storeRole} from "./libs/lib";
import zhCN from "antd/locale/zh_CN";
import "dayjs/locale/zh-cn";
import dayJs from "dayjs";
import eventBus from "vc-subscribe-publish";
import {useSafeState} from "ahooks";

export const id = "big-sur-2023";
const {Content, Sider} = Layout;
dayJs.locale("zh-cn");


const App = () => {
  const [collapsed, setCollapsed] = useState(true);
  const _theme = useHookstate(storeTheme);
  const [messageApi, contextHolder] = message.useMessage();
  const [fullScreenState, setFullScreenState] = useSafeState(false);
  const _role = useHookstate(storeRole);
  let navigate = useNavigate();

  useEffect(() => {
    eventBus.subscribe("onMessage", function(args) {
      if (args && args[0] === "error") {
        messageApi.error(args[1] || "错误");
      } else {
        messageApi.info(args[0]);
      }
    });

    eventBus.subscribe("onNavigate", function(args) {
      if (args[0] === window.location.pathname) return;
      navigate(args[0]+"?url=" + window.location.pathname);
    });

    eventBus.subscribe("fullscreenchange", function(args) {
      setFullScreenState(args[0]);
    });
  }, []);
  const local = useLocalStorage();
  _role.set(local.info?.dataType);
  return (
    <div className={`app base ${_theme.theme.get()}-theme`} id={id}>
      <ConfigProvider locale={zhCN} theme={{
        token: {
          colorPrimary: "#389895",
          colorBorder: "#389880"
        },
        components: {
          menu: {
            background: "none"
          }
        },
        // 1. 单独使用暗色算法
        algorithm: Object.is(_theme.theme.get()
            , "dark") ? theme.darkAlgorithm : theme.defaultAlgorithm
        // 2. 组合使用暗色算法与紧凑算法
        // algorithm: [theme.darkAlgorithm, theme.compactAlgorithm],
      }}>
        <AntdApp style={{height: "100%"}}>
          <Layout style={{padding: 0}} id="header-bar">
            <HeaderBar/>
          </Layout>
          <Layout style={{height: "calc(100% - 64px)"}}>
            {!fullScreenState && <Sider width={collapsed ? 60 : 200} style={{background: "var(--background-color)"}}>
              <MenuList onChange={setCollapsed}/>
            </Sider>}
            <Content>
              <Routes>
                {
                  routes.map((item) => {
                    return (
                      <Route path={item.path} element={item.component} name={item.name}
                        key={item.path}/>
                    );
                  })
                }
              </Routes>
            </Content>
          </Layout>
          {/* <Drawer title="消息通知" placement="right" onClose={()=> onDrawerToggle(false)} open={drawerOpen}>*/}
          {/*  <Notification />*/}
          {/* </Drawer>*/}
          {contextHolder}
        </AntdApp>
      </ConfigProvider>

    </div>
  );
};

export default App;


