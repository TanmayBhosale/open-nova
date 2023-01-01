import {useRouter} from "next/router"
import { useEffect, useRef } from "react"
import Router from "next/router"
import getBaseUrl from "../../helpers/getBaseUrl"
import TwitterTokens from "../../types/TwitterTokens"
import CustomError from "../../types/CustomError"
import axios from "axios"
import UserModel from "../../models/UserModel"
import { createOrUpdateUser } from "../../backend"
import { saveUserId } from "../../helpers/userId"
import { saveTokenToCookie } from "../../helpers/tokens"
import { GetServerSidePropsContext } from "next"
// import { getTokensFromTwitter } from "../api/twitter/get-tokens"
// import { getTwitterUser } from "../api/twitter/get-user"
import axiosFe from "../../axios/fe"
import { getTokensFromTwitter } from "../api/twitter/tokens/get"
import { getTwitterUser } from "../api/twitter/user/get"

type TokenProps = {
    tokens : TwitterTokens | null
    error : CustomError | null
}

const Token = ({tokens,error}:TokenProps)=>{

    useEffect(()=>{
        
    },[])

    return(
        <div>
            <p className="text-white">{error && "Unable to Authenticate"}</p>
            {/* <button onClick={redirect} className=" bg-blue-500">Go to Dashboard</button> */}
        </div>
    )
}

export async function getServerSideProps({req,res , query} : GetServerSidePropsContext){
    let tokens: TwitterTokens | null = null
    let error : string | null = null
    let user: UserModel | null
    try{
        tokens = await getTokensFromTwitter(query,req,res)
        console.log(tokens)
        user = await getTwitterUser(tokens.accessToken,tokens.refreshToken,req,res)
    }catch(e:any){
        console.log(e)
        error = "err"
        //{message : e.message, err: JSON.stringify(e.err)}
    }
    
    return{
        props:{tokens,error}
    }
}


export default Token