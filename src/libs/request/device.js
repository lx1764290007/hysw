import {useFetch} from "./base";

export const fetchDeviceAdd = async (data)=>{
  return await useFetch({
    url: "device/manage/add",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchDeviceList = async (data)=>{
  return await useFetch({
    url: "device/manage/list",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchDeviceUpdateGroup = async (data)=>{
  return await useFetch({
    url: "device/manage/update/groupId",
    config: {
      method: "POST"
    },
    data
  });
};

export const fetchDeviceRemove = async (data)=>{
  return await useFetch({
    url: "device/manage/remove",
    config: {
      method: "POST"
    },
    data
  });
};

export const fetchDeviceSearch = async (data)=>{
  return await useFetch({
    url: "device/manage/search",
    config: {
      method: "GET"
    },
    data
  });
};

export const fetchDeviceUpdate = async (data)=>{
  return await useFetch({
    url: "device/manage/update",
    config: {
      method: "POST"
    },
    data
  });
};

export const fetchDevice = async (id)=>{
  return await useFetch({
    url: `device/manage/${id}`,
    config: {
      method: "GET"
    }
  });
};
