import {useFetch} from "./base";

export const fetchGroupAdd = async (data)=>{
  return await useFetch({
    url: "device/group/add",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchGroupList = async (data)=>{
  return await useFetch({
    url: "device/group/list",
    data
  });
};

export const fetchGroupRemove = async (data)=>{
  return await useFetch({
    url: "device/group/remove",
    config: {
      method: "POST"
    },
    data
  });
};

export const fetchGroupSearch = async (data)=>{
  return await useFetch({
    url: "device/group/search",
    config: {
      method: "GET"
    },
    data
  });
};

export const fetchGroupUpdate = async (data)=>{
  return await useFetch({
    url: "device/group/update",
    config: {
      method: "POST"
    },
    data
  });
};
