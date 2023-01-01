import axios from "axios";
import { getTokenFromCookie, saveTokenToCookie } from "../helpers/tokens";
import { getUserId } from "../helpers/userId";

const axiosFe = axios.create();

axiosFe.defaults.withCredentials = true

axiosFe.interceptors.request.use((config) => {
    console.log("intercept")
    config.headers!["twitter_access_token"] = getTokenFromCookie("access")
    config.headers!["twitter_refresh_token"] = getTokenFromCookie("refresh")
    config.headers!["open_nova_user"] = getUserId()
    return config
})

axiosFe.interceptors.response.use((res)=>{
    console.log("trying...")
    console.log(getTokenFromCookie("access",null,res))
    // saveTokenToCookie("access","hiii")
    // console.log(res.config.headers)
    return res
})

export default axiosFe