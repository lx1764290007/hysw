import React from "react";
import {id} from "../App";
import vcSubscribePublish from "vc-subscribe-publish";
import {hookstate} from "@hookstate/core";
import eventBus from "vc-subscribe-publish";
const canSetFullState = function() {
  return (
    document.fullscreenElement ||
        document.mozFullScreenElement ||
        document.webkitFullscreenElement
  );
};
// eslint-disable-next-line max-len
const setFullScreen = function(element = document.getElementById("root"), toggle = false) {
  if (canSetFullState() === false) return false;
  const fullScreenElement = document.fullscreenElement;
  if (fullScreenElement && toggle) {
    fullScreenElement.exitFullscreen &&
    fullScreenElement.exitFullscreen()
        .catch((err) => console.error(err));
    document.exitFullscreen().catch((err) => console.error(err));
  } else if (!fullScreenElement) {
    element.requestFullscreen().catch((err) => console.error(err));
  } else {
    return false;
  }
};
export const useFullScreen = function() {
  const [state, setState] = React.useState(Boolean(document.fullscreenElement));

  const callback = function(element, toggle) {
    setFullScreen(element, toggle);
    listenFullScreenChange(setState);
  };
  return [state, callback];
};
const listenFullScreenChange = function(setState) {
  const handler = () => {
    if (document.fullscreenElement === null) {
      // 退出全屏时候解除监听，不然每次监听都会添加一次绑定
      document.removeEventListener("fullscreenchange", handler);
      setState(false);
      vcSubscribePublish.public("fullscreenchange", false);
    } else {
      setState(true);
      vcSubscribePublish.public("fullscreenchange", true);
    }
  };
  document.addEventListener("fullscreenchange", handler);
};

export const defaultTheme = "dark";
export const useTheme = function() {
  const [state, setState] = React.useState(defaultTheme);
  const callback = function() {
    const element = document.querySelector(`#${id}`);

    const isLightTheme = element?.classList.contains("light-theme");
    if (element) {
      if (isLightTheme) {

        element.classList.remove("light-theme");
        element.classList.add("dark-theme");
        setState("dark");
        vcSubscribePublish.public("useTheme", "dark");
      } else {
        element.classList.remove("dark-theme");
        element.classList.add("light-theme");
        setState("light");
        vcSubscribePublish.public("useTheme", "light");
      }
    }
  };
  return [state, callback];
};

export const iconFontUrl = "//at.alicdn.com/t/c/font_4190162_80ixuzedpp.js";


export const storeTheme = hookstate({
  theme: defaultTheme,
  fullScreen: false
});

export const storeNews = hookstate({
  data: [],
  k: 0,
  record: []
});
export const storeNotificationNews = hookstate({
  data: [],
  k: 0,
  record: []
});
export const storeNotify = hookstate([]);
export const deviceState = hookstate([]);

export const menuVisible = function(menuItem) {
  const menuVisibleListKey = ["/", "device", "task", "sensor", "notification", "trigger", "file", "user", "collect",
    ""];
  return menuVisibleListKey.includes(menuItem.key);

};

/**
 * Toast提示类
 */
class ToastEventBus {
  #timeout = null;
  #eventLoop = [];
  #duration = 60;
  /**
   * 间隔时间
   * @param {number|undefined} duration
   */
  constructor(duration=60) {
    this.#duration = duration;
    this.eventBusHandler = this.eventBusHandler.bind(this);
    this.eventLoopHandler = this.eventLoopHandler.bind(this);
  }
  /**
   * 自定义事件总线
   * @return {Promise<void>}
   */
  async eventBusHandler() {
    this.#timeout && clearTimeout(this.#timeout);
    await this.#eventLoop[0]?.();
    this.#eventLoop = this.#eventLoop.filter((_, i)=> i > 0);
    this.#timeout = setTimeout(this.eventBusHandler, this.#duration);
  }
  /**
   * 加入eventLoop循环
   * @param {Promise<Function>} event
   */
  eventLoopHandler(event) {
    this.#eventLoop.push(event);
  };

  /**
   * 查询当前队列
   * @return {Promise<Function>[]}
   */
  get eventLoop() {
    return this.#eventLoop;
  }

  /**
   * 清除剩余队列
   */
  clear() {
    this.#eventLoop = [];
  }
}

/**
 * Alert确认框类
 */
class AlertEventBus extends ToastEventBus {
  #timeout = null;
  #eventLoop = [];
  #duration = 60;
  // eslint-disable-next-line require-jsdoc
  constructor() {
    super();
    this.updateEventLoop = this.updateEventLoop.bind(this);
  }
  /**
   * 加入eventLoop循环
   * @param {Promise<Function>} fn
   * @param {{key:number, state:boolean}} param
   */
  alertEventLoopHandler(fn, param) {
    this.#eventLoop.push({callback: fn, ...param});
  };
  /**
   * 自定义事件总线
   * @return {Promise<void>}
   */
  async eventBusHandler() {
    this.#timeout && clearTimeout(this.#timeout);
    if (!this.#eventLoop[0]?.state) {
      await this.#eventLoop[0]?.callback?.();
    } else {
      this.#eventLoop = this.#eventLoop.filter((_, i)=> i > 0);
    }
    this.#timeout = setTimeout(this.eventBusHandler, this.#duration);
  }
  /**
   * 更新状态
   * @param {number} key
   */
  updateEventLoop(key) {
    const index = this.#eventLoop.findIndex((it)=> it.key === key);
    if (index> -1) {
      this.#eventLoop[index]["state"] = true;
    }
  }
  // eslint-disable-next-line require-jsdoc
  clear() {
    super.clear();
    this.#eventLoop = [];
  }
}
export const Toast = new ToastEventBus(60);
export const Alert = new AlertEventBus(100);

class LocalStorage {
  #INFO_KEY = "user";
  constructor() {
    this.clearInfo = this.clearInfo.bind(this);
  }
  get info() {
    return JSON.parse(window.localStorage.getItem(this.#INFO_KEY));
  }
  set info(value) {
    window.localStorage.setItem(this.#INFO_KEY, JSON.stringify(value));
  }
  clearInfo() {
    window.localStorage.removeItem(this.#INFO_KEY);
  }
}

export const useLocalStorage = ()=> new LocalStorage();
export const storeRole = hookstate(null);
export const logoutHandle = ()=>{
  eventBus.public("onNavigate", "/login");
  useLocalStorage().clearInfo();
};
