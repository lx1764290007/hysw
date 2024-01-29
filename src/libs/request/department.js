import {useFetch} from "./base";

export const fetchDepartmentAdd = async (data)=>{
    return await useFetch({
        url: "department/add",
        config: {
            method: "POST"
        },
        data
    });
}
export const fetchDepartmentList = async (data)=>{
    return await useFetch({
        url: "department/list",
        data
    });
}

export const fetchDepartmentRemove = async (data)=>{
    return await useFetch({
        url: "department/remove",
        config: {
            method: "POST"
        },
        data
    });
}

export const fetchDepartmentSearch = async (data)=>{
    return await useFetch({
        url: "department/search",
        config: {
            method: "GET"
        },
        data
    });
}

export const fetchDepartmentUpdate = async (data)=>{
    return await useFetch({
        url: "department/update",
        config: {
            method: "POST"
        },
        data
    });
}

