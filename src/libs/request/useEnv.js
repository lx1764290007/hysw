class UseEnv {
    public BASE_URL;
    public SOCKET_URL;

    constructor() {
        if(import.meta.env.DEV){
            this.BASE_URL =  `//${window.location.host}/plus-api` //http://192.168.80.1:5173/plus-api` // "http://192.168.80.1:5173/plus-api";
            this.SOCKET_URL =  "ws://61.146.45.234:3302/api/connectWebSocket"
        } else {
            this.BASE_URL = `//${window.location.host}/api`; //"http://192.168.12.80:8888/api" //"http://itao-tech.com:8888/api" //"http://61.146.45.234:3302/api";
            this.SOCKET_URL = `ws://${window.location.host}/connectWebSocket`//"ws://192.168.12.80:8888/api/connectWebSocket" //"ws://61.146.45.234:3302/api/connectWebSocket"
        }
    }
    setLocalUrl(value:string){
        window.localStorage.setItem("local_url",value)
    }
    getLocalUrl(){
        return window.localStorage.getItem("local_url")
    }
    get baseUrl(){
        return this.BASE_URL
    }
    get socketUrl(){
        return this.SOCKET_URL
    }
}
export const useEnv = function(){
    return new UseEnv()
}
