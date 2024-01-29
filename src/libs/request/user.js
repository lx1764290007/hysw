import {useFetch} from "./base";

export const fetchUserList = async (data)=>{
  return await useFetch({
    url: "user/list",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchUserSearch = async (data)=>{
  return await useFetch({
    url: "user/search",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchUserAdd = async (data)=>{
  return await useFetch({
    url: "user/add",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchUserRemove = async (data)=>{
  return await useFetch({
    url: "user/remove",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchUserUpdate = async (data)=>{
  return await useFetch({
    url: "user/update",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchWechatCode = async (data)=>{
  return await useFetch({
    url: "wechat/getApp",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchRoleList = async (data)=>{
  return await useFetch({
    url: "role/list",
    config: {
      method: "GET"
    },
    data
  });
};
