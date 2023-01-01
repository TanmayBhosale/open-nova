import axios from "axios"
import {NextApiRequest, NextApiResponse} from "next"
import { createOrUpdateUser } from "../../../../backend"
import { saveUserId } from "../../../../helpers/userId"
import UserModel from "../../../../models/UserModel"

export default async function handler(req:NextApiRequest,res:NextApiResponse){
    console.log("req@ get-twitter-user")
    try{
        const accessToken = req.headers["twitter_access_token"]
        const refreshToken = req.headers["twitter_refresh_token"]
        // const twitterUser = await getTwitterUser(accessToken,refreshToken,req,res)
        console.log(req.headers)
        res.status(200).json({user:"hi"})
    }catch(e:any){
        console.log(e)
            res.status(404).json({err:"err"})
    }
}

export function getTwitterUser(accessToken:string,refreshToken:string,req:any,res:any){
    return new Promise<UserModel>(async(resolve,reject) => {
        try{
            const {data,status} = await axios.get("https://api.twitter.com/2/users/me",{
                params:{
                    "user.fields":"profile_image_url,public_metrics"
                },
                headers:{
                    "Authorization" : `Bearer ${accessToken}`
                }
            })
            let twitterUser: UserModel = {
                id : "",
                name : data.data.name,
                twitterId : data.data.id,
                handle : data.data.username,
                imageURL : data.data.profile_image_url,
                joiningDate : new Date().toISOString(),
                activeDays : 0,
                currentStreak : 0,
                longestStreak : 0,
                targetFollowers : 0,
                followers : data.data.public_metrics.followers_count,
                following: data.data.public_metrics.following_count,
                tweets: 0,
                lastTweetDateAndTime : new Date().toISOString()
            }
            twitterUser = await  createOrUpdateUser(twitterUser)
            saveUserId(twitterUser.id,req,res)
            resolve(twitterUser)
        }catch(e:any){
            reject(e)
        }
    })
}