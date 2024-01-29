import {useFetch} from "./base";

export const fetchTriggerAdd = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/add",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchTriggerList = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/list",
    data
  });
};

export const fetchTriggerRemove = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/remove",
    config: {
      method: "POST"
    },
    data
  });
};

export const fetchTriggerSearch = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/search",
    config: {
      method: "GET"
    },
    data
  });
};

export const fetchTriggerUpdate = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/update",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchTriggerType = async ()=>{
  return await useFetch({
    url: "sensor/triggerType/settings/list",
    config: {
      method: "GET"
    }
  });
};
