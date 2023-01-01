import Router from "next/router"
import { useEffect } from "react"
import {auth} from "../../twitter/backend"

const Auth = ()=>{
    const loginWithTwitter = ()=>{
        auth(window.location.href+"/token")
    }
    return(
        <div>
            <button onClick={loginWithTwitter} className=" bg-blue-600">Login with Twitter</button>
        </div>
    )
}

export default Auth