import { saveTokenToCookie } from "../../../../helpers/tokens";
import CustomError from "../../../../types/CustomError";
import TwitterTokens from "../../../../types/TwitterTokens";
import {getTokens} from "../../../../twitter/backend"
import getBaseUrl from "../../../../helpers/getBaseUrl";
import { NextApiRequest, NextApiResponse } from "next";


export default function helper(req : NextApiRequest, res: NextApiResponse){
    try{
        const tokens = getTokensFromTwitter(req.query,req,res)
        res.json({tokens})
    }catch(e){
        const err:CustomError = {message : "unable to get tokens",err:e}
        res.status(404).json(err)
    }
}

export function getTokensFromTwitter(query:any,req:any,res:any){
    return new Promise<TwitterTokens>(async(resolve,reject) => {
        try{
            const tokens = await getTokens(getBaseUrl()+"/auth/token",query.state!.toString(),query.code!.toString())
            saveTokenToCookie("access",tokens.accessToken,req,res)
            saveTokenToCookie("refresh",tokens.refreshToken,req,res)
            resolve(tokens)
        }catch(e:any){
            reject(e)
        }
    })
}