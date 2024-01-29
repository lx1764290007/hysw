import {useFetch} from "./base";

export const loginHandle = async (data)=>{
  return await useFetch({
    url: "login",
    config: {
      method: "POST"
    },
    data
  });
};
export const refreshInfo = async ()=>{
  return await useFetch({
    url: "login/me"
  });
};

export const logoutHandle = async (data)=>{
  return await useFetch({
    url: "login/out",
    config: {
      method: "POST"
    },
    data
  });
};
