import {useFetch} from "./base";
export const fetchUpdateSearch = async (data)=>{
  return await useFetch({
    url: "updateTask/search",
    config: {
      method: "GET"
    },
    data
  });
};
export const fetchUpdateRemove = async (data)=>{
  return await useFetch({
    url: "updateTask/remove",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchUpdateAdd = async (data)=>{
  return await useFetch({
    url: "updateTask/add",
    config: {
      method: "POST"
    },
    data
  });
};
