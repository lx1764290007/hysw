import React from "react";
import ReactDOM from "react-dom/client";
import {Toast as ToastReact} from "./Toast";
import {Toast as ToastClass} from "../../libs/lib";


let GlobalRootNode = null;
/**
 * Toast 类
 * @constructor
 * @class
 * @classdesc - 用于管理全局的Toast，单例。Toast实例会被放入到堆栈中依次展示
 */
export class Toast {
  #_mountedDom = null;
  #_ID = "toast-8-9_123DKl--ii";

  /**
   * @constructor
   */
  constructor() {
    if (document.querySelector(`#${this.#_ID}`)) {
      this.#_mountedDom = document.querySelector(`#${this.#_ID}`);
    } else {
      this.#_mountedDom = document.createElement("div");
      this.#_mountedDom.setAttribute("id", this.#_ID);
      document.documentElement.appendChild(this.#_mountedDom);
    }
    if (!GlobalRootNode) {
      GlobalRootNode = ReactDOM.createRoot(this.#_mountedDom);
    }
    this.hide = this.hide.bind(this);
  }
  /**
   *  Toast展示
   *  @param {string|ReactNode} content - Toast内容
   */
  show(content) {
    ToastClass.eventLoopHandler(this.#done.bind(this, [content]));
  }
  /**
   * 有序展示
   * @param {string|ReactNode} content - Toast内容
   */
  async #done(content) {
    const _this = this;
    return new Promise((resolve) => {
      GlobalRootNode?.render(<ToastReact content={content} />);
      setTimeout(()=>{
        _this.hide();
        resolve();
      }, 2200);
    });
  }
  /**
   * Toast隐藏
   */
  hide() {
    GlobalRootNode?.unmount(<ToastReact />);
    GlobalRootNode = ReactDOM.createRoot(this.#_mountedDom);
  }
  /**
   * 查询当前队列
   * @return {Promise<Function>[]}
   */
  get eventLoop() {
    return ToastClass.eventLoop;
  }
  /**
   * 清除剩余队列
   */
  clear() {
    ToastClass.clear();
  }
}

/**
 * Toast组件，包含两个基本方法
 * @return {Toast}
 */
export const useToast = ()=> new Toast();
