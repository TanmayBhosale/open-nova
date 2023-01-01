import axios from "axios";
import { getTokenFromCookie, saveTokenToCookie } from "../helpers/tokens";
import { refreshAccessToken } from "../twitter/backend";

const axiosBe = axios.create()

axiosBe.interceptors.request.use((config) => {
    
    // console.log("intercept "+config.headers!["access_token"])
    config.headers!["Authorization"] = "Bearer "+ config.headers!["access_token"]
    return config
})

axiosBe.interceptors.response.use(async(res)=>{
    // console.log("headers: ")
    // console.log(res.config.headers)
    return res
},
async(err)=> {
    console.log("retying...")
    const ogRequest = err.config
    const refreshToken = ogRequest.headers.refresh_token
    // console.log(ogRequest.headers)
    if(err.response.status === 401 && !ogRequest._retry){
        ogRequest._retry = true
        try{
            const tokens = await refreshAccessToken(refreshToken)
            ogRequest.headers.access_token = tokens.accessToken
            ogRequest.headers.refresh_token = tokens.refreshToken
            return axiosBe(ogRequest)
        }catch(e){
            console.log("err at be")
            return Promise.reject(e)
        }
    }
    // console.log(err.response.status)
})

export default axiosBe