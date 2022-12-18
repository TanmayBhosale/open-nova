import {setCookie , getCookie} from "cookies-next"

function saveUserId(id:string,req:any,res:any){
    // localStorage.setItem("open_nova_user_id",id)
    setCookie("open_nova_user_id",id,{req,res})
    
}

function getUserId(req:any,res:any){
    // return localStorage.getItem("open_nova_user_id")
    const id = getCookie("open_nova_user_id",{req,res})
}

export {saveUserId,getUserId}