// /sensor/trigger/record/record/search

import {useFetch} from "./base";

export const fetchRecordList = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/record/list",
    data
  });
};


export const fetchRecordSearch = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/record/search",
    config: {
      method: "GET"
    },
    data
  });
};

export const fetchRecordUpdate = async (data)=>{
  return await useFetch({
    url: "sensor/trigger/record/updateHandler",
    config: {
      method: "POST"
    },
    data
  });
};
