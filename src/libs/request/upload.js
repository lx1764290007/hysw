import {URL} from "./socket";
import {useFetch} from "./base";
export const UPLOAD_URL = URL + "/api/device/update_file/upload";
export const fetchUpload = async (data)=>{
  return await useFetch({
    url: "device/update_file/upload",
    config: {
      method: "POST"
    },
    data
  });
};
export const fetchFileList = async (data)=>{
  return await useFetch({
    url: "device/update_file/list",
    config: {
      method: "GET"
    },
    data
  });
};
