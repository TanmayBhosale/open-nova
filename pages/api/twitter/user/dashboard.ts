import {NextApiRequest,NextApiResponse} from "next"
import { saveTokenToCookie } from "../../../../helpers/tokens"
import { getTweets, getUpdatedUser, getUser } from "../../../../twitter/backend"
import CustomError from "../../../../types/CustomError"

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    
}

export function getDashboard(accessToken:string,refreshToken:string,userId:string,req:any,res:any){
    return new Promise(async(resolve,reject) => {
        // let accessToken = req.headers["twitter_access_token"] as string
        // let refreshToken = req.headers["twitter_refresh_token"] as string
        // const userId = req.headers["open_nova_user"] as string
        try{
            const {data,tokenPair} = await getUpdatedUser(accessToken,refreshToken,userId)
            if(tokenPair){
                saveTokenToCookie("access",tokenPair.accessToken,req,res)
                saveTokenToCookie("refresh",tokenPair.refreshToken,req,res)
                accessToken = tokenPair.accessToken
                refreshToken = tokenPair.refreshToken
            }
            // await getTweets(accessToken,refreshToken,data.twitterId,data.lastTweetDateAndTime)      
            // console.log(data)
            resolve({user:data})
        }catch(e){
            console.log(e)
            reject(<CustomError>{message:"unable to get User",err:null})
        }
    })
}