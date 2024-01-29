import React from "react";
import ReactDOM from "react-dom/client";
import {Alert as AlertReact} from "./Alert";
import {Alert as AlertClass} from "../../libs/lib";


let GlobalRootNode = null;
/**
 * Alert 类
 * @constructor
 * @class
 * @classdesc - 用于管理全局的Alert，单例。Alert实例会被放入到堆栈中依次展示
 */
export class Alert {
  #_mountedDom = null;
  #_ID = "alert-1-n_13Dpl-bi";
  #_count = 0;
  /**
   * 构造体
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
     *  Alert展示
     *  @param {string|ReactNode} title - Alert内容
     *  @param {string|ReactNode} content
     */
  show(title, content) {
    AlertClass.alertEventLoopHandler(this.#done.bind(this, [title, content, this.#_count]), {key: this.#_count, state: false});
    this.#_count += 1;
  }
  /**
     * 有序展示
     * @param {string[]|ReactNode[]} args  - Alert内容
     */
  async #done(args) {
    GlobalRootNode?.render(<AlertReact content={args[1]} title={args[0]} onOk={()=>this.hide(args[2])} />);
    return Promise.resolve();
  }
  /**
   * @param {number} key
   * Alert隐藏
   */
  hide(key) {
    GlobalRootNode?.unmount(<AlertReact />);
    GlobalRootNode = ReactDOM.createRoot(this.#_mountedDom);
    AlertClass.updateEventLoop(key);
  }
  /**
     * 查询当前队列
     * @return {Promise<Function>[]}
     */
  get eventLoop() {
    return AlertClass.eventLoop;
  }
  /**
     * 清除剩余队列
     */
  clear() {
    AlertClass.clear();
  }
}

/**
 * Alert组件，包含两个基本方法
 * @return {Alert}
 */
export const useAlert = ()=> new Alert();
