import {useFetch} from "./base";

export const fetchSensorAdd = async (data)=>{
  return await useFetch({
    url: "sensor/mange/add",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchSensorList = async (data)=>{
  return await useFetch({
    url: "sensor/mange/list",
    data
  });
};

export const fetchSensorRemove = async (data)=>{
  return await useFetch({
    url: "sensor/mange/remove",
    config: {
      method: "POST"
    },
    data
  });
};

export const fetchSensorSearch = async (data)=>{
  return await useFetch({
    url: "sensor/mange/search",
    config: {
      method: "GET"
    },
    data
  });
};

export const fetchSensorUpdate = async (data)=>{
  return await useFetch({
    url: "sensor/mange/update",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchSensorType = async ()=>{
  return await useFetch({
    url: "sensorType/settings/list",
    config: {
      method: "GET"
    }
  });
};
export const fetchCollect = async (data)=>{
  return await useFetch({
    url: "collect/list",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchCollectSearch = async (data)=>{
  return await useFetch({
    url: "collect/search",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchTypeCount = async (data)=>{
  return await useFetch({
    url: "sensor/mange/type/count",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchAlarmCount = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/record/alarm/count",
    config: {
      method: "GET"
    },
    data
  });
};
