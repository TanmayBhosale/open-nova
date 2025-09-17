import axios, { AxiosRequestConfig } from "axios"
import axiosBe from "../axios/be"
import { getUserFromDb } from "../backend"
import UserModel from "../models/UserModel"
import CustomError from "../types/CustomError"
import Tweet from "../types/Tweet"
import TwitterData, { TokenPair } from "../types/TwitterData"
import TwitterTokens from "../types/TwitterTokens"
import {twitterClientId , twitterClientSecret, scopes, state} from "./config"

// backend code
function auth(redirectURL:string){
    console.log(window.location)
    const authUrl = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitterClientId}&redirect_uri=${redirectURL}&scope=${scopes.join('%20')}&state=${state}&code_challenge=challenge&code_challenge_method=plain`
    window.location.replace(authUrl)
}

// backend code
function getTokens(redirectURL:string,state:string,code:string){
    return new Promise<TwitterTokens>(async(resolve,reject) => {
        try{
            const res = await axios.post(
                'https://api.twitter.com/2/oauth2/token',
                {
                    code,
                    "grant_type":"authorization_code",
                    // "client_id" : twitterClientId,
                    "redirect_uri" : redirectURL,
                    "code_verifier" : "challenge"
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        "Authorization" : "Basic "+ Buffer.from(twitterClientId +":"+twitterClientSecret).toString("base64")
                    }
                }
            );
            const tokens: TwitterTokens = {
                tokenType : res.data.token_type,
                accessToken : res.data.access_token,
                refreshToken : res.data.refresh_token,
                scope : res.data.scope
            }
            resolve(tokens)
        }catch(e){
            const err: CustomError = {message : 'Unavle to authenticate user',err:e}
            reject(err)
        }
    })
}

function refreshAccessToken(refreshToken:string){
    return new Promise<TwitterTokens>(async(resolve,reject) => {
        try{
            const {data} = await axios.post("https://api.twitter.com/2/oauth2/token",
            {
                'refresh_token' : refreshToken,
                'grant_type' : "refresh_token",
                // 'access_token' : accessToken
            },
            {
                headers:{
                    'Content-Type': 'application/x-www-form-urlencoded',
                    "Authorization" : "Basic "+ Buffer.from(twitterClientId +":"+twitterClientSecret).toString("base64")
                }
            })
            const tokens:TwitterTokens = {
                tokenType : data.token_type,
                accessToken : data.access_token,
                scope: data.scope,
                refreshToken : data.refresh_token
            }
            resolve(tokens)
        }catch(e){
            console.log(e)
            const err: CustomError = {message:"cannot refresh token",err:e}
            reject(err)
        }
    })
}

function getUser(accessToken:string,refreshToken:string){
    return new Promise<TwitterData<UserModel>>(async(resolve,reject)=>{
        try{
            const {data,config} = await axiosBe.get("https://api.twitter.com/2/users/me",
            {
                headers:{
                    'access_token' : accessToken,
                    'refresh_token' : refreshToken
                },
                params:{
                    "user.fields":"profile_image_url,public_metrics"
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
            
            const res: TwitterData<UserModel> = {
                data : twitterUser,
                tokenPair : null
            }

            if(refreshToken != config.headers!["refresh_token"] || accessToken != config.headers!["access_token"]){
                res.tokenPair = {
                    accessToken : <string>config.headers!["access_token"],
                    refreshToken : <string>config.headers!["refresh_token"]
                }
            }
            
            resolve(res)
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}

function getTweets(accessToken:string,refreshToken:string,twitterId:string,time?:string){
    return new Promise<TwitterData<Tweet[]>>(async(resolve,reject)=>{
        try{
            const headers = {
                'access_token' : accessToken,
                'refresh_token' : refreshToken
            }
            const tweetFields = "id,created_at"
            const maxResult = 11

            let q = `https://api.twitter.com/2/users/${twitterId}/tweets` //+ time == undefined ? "" : "?start_time="+time
            console.log(q)
            const {data,config} = await axiosBe.get(q,
                {
                    headers,
                    params:{
                        "max_results" : maxResult,
                        "tweet.fields" : tweetFields

                    }
                })
            const tweets: Tweet[] = []
            data.data.forEach(({id,text,created_at}:{id:string,text:string,created_at:string}) => {
                tweets.push({
                    id,
                    text,
                    createdAt: created_at
                })
            })
            if(!time){
                const res:TwitterData<Tweet[]> = {
                    data : tweets,
                    tokenPair : addTokensIfChanged(headers.access_token,headers.refresh_token,config)
                }
                console.log(data)
                return resolve(res)
            }
            if(addTokensIfChanged(headers.access_token,headers.refresh_token,config)){
                const {accessToken,refreshToken} = addTokensIfChanged(headers.access_token,headers.refresh_token,config)!
                headers.access_token = accessToken,
                headers.refresh_token = refreshToken
            }
            let nextToken = data.meta.next_token
            let lastTweetId = data.meta.oldest_id
            while(new Date(tweets[tweets.length-1].createdAt).getTime() > new Date(time).getTime()){
                console.log(new Date(tweets[tweets.length-1].createdAt).getTime() +" "+ new Date(time).getTime())
                const {data,config} = await axiosBe.get(q,
                    {
                        headers,
                        params:{
                            "max_results" : maxResult,
                            "tweet.fields" : tweetFields,
                            "pagination_token" : nextToken
                        }
                    }) 
                    console.log(data)
                    if(nextToken == data.meta.next_token || lastTweetId == data.meta.oldest_id) break
                    nextToken = data.meta.next_token
                    lastTweetId = lastTweetId == data.meta.oldest_id
                    if(addTokensIfChanged(headers.access_token,headers.refresh_token,config)){
                        const {accessToken,refreshToken} = addTokensIfChanged(headers.access_token,headers.refresh_token,config)!
                        headers.access_token = accessToken,
                        headers.refresh_token = refreshToken
                    }
                    for(let i=0;i<data.data.length;i++){
                        const {id,text,created_at} = data.data[i]
                        tweets.push({
                            id,
                            text,
                            createdAt: created_at
                        })
                        if(new Date(tweets[tweets.length-1].createdAt).getTime() > new Date(time).getTime()) break
                    }
            }
            console.log(tweets)
            resolve(<TwitterData<Tweet[]>>{
                data : tweets,
                tokenPair: addTokensIfChanged(headers.access_token,headers.refresh_token,config)
            })
        }catch(e){
            console.log(e)
            reject(e)
        }
    })
}

function searchUserV1(accessToken:string,refreshToken:string,keywords:string[]){
    return new Promise(async(resolve,reject) => {
        try{
            if(!accessToken || !refreshToken) throw(<CustomError>{err:404,message:"no tokens found"})
            const headers = {
                "access_token":"AAAAAAAAAAAAAAAAAAAAAH2GkAEAAAAApYBltq0tLTGTCFlSxHw832Af0RA%3DEv3teFkKevZYoj1jZV7bFpRQiNTOjfPpq8Dkx6HYpX6PVGA8Rt",
                "refresh_token":refreshToken
            }
            const res = await axiosBe.get("https://api.twitter.com/1.1/users/search.json",{
                headers,
                params:{
                    q : keywords.join(",")
                }
            })
            if(addTokensIfChanged(headers.access_token,headers.refresh_token,res.config)){
                const {accessToken,refreshToken} = addTokensIfChanged(headers.access_token,headers.refresh_token,res.config)!
                headers.access_token = accessToken
                headers.refresh_token = refreshToken
            }
            console.log(res.headers)
            resolve("")
        }catch(e){
            console.log(e)
            reject(e)
        }
        
    })
}

function getUpdatedUser(accessToken:string,refreshToken:string,userId:string){
    return new Promise<TwitterData<UserModel>>(async(resolve,reject) => {
        try{
            let res = await getUser(accessToken,refreshToken)
            const twitterUser = res.data
            const dbUser = await getUserFromDb(userId)
            if(!dbUser) throw ("user not found")
            const updatedUser:UserModel = {
                id : dbUser.id,
                name : twitterUser.name,
                twitterId : twitterUser.twitterId,
                handle : twitterUser.handle,
                imageURL : twitterUser.imageURL,
                joiningDate : dbUser.joiningDate,
                activeDays : dbUser.activeDays,
                currentStreak : dbUser.currentStreak,
                longestStreak : dbUser.longestStreak,
                targetFollowers: dbUser.targetFollowers,
                followers : twitterUser.followers,
                following : twitterUser.following,
                tweets : twitterUser.tweets,
                lastTweetDateAndTime : dbUser.lastTweetDateAndTime
            }
            const reso: TwitterData<UserModel> = {
                data : updatedUser,
                tokenPair : res.tokenPair
            }
            resolve(reso)
        }catch(e){
            reject(e)
        }
    })
}


function addTokensIfChanged(accessToken:string,refreshToken:string,config:AxiosRequestConfig<any>):TokenPair | null{
    if(refreshToken != config.headers!["refresh_token"] || accessToken != config.headers!["access_token"]){
        return <TokenPair>{
            accessToken : <string>config.headers!["access_token"],
            refreshToken : <string>config.headers!["refresh_token"]
        }
    }

    return null
}


export {auth,getTokens,refreshAccessToken,getUser,getTweets,getUpdatedUser,searchUserV1}