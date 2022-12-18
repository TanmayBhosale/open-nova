import {setCookie , getCookie} from "cookies-next"

function saveTokenToCookie(tokenType:"access"|"refresh",token:string,req?:any,res?:any){
    // localStorage.setItem(`twitter_${tokenType}_token`,token)
    setCookie(`twitter_${tokenType}_token`,token,{req,res,expires : new Date(9999,12,21)})
}

function getTokenFromCookie(tokenType:"access"|"refresh",req?:any,res?:any){
    const token = getCookie(`twitter_${tokenType}_token`,{req,res})
    if(!token) return null
    return token.toString()
}

export {saveTokenToCookie,getTokenFromCookie}