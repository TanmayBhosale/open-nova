// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getTokenFromCookie, saveTokenToCookie } from '../../helpers/tokens'
import {getUser, refreshAccessToken} from "../../twitter/backend"
import TwitterTokens from '../../types/TwitterTokens'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // console.log("@ hello: "+getTokenFromCookie("access",req,res))
  // console.log("access "+req.headers["twitter_access_token"])
  // const at = req.headers["twitter_access_token"] as string
  // const rt = req.headers["twitter_refresh_token"] as string
  // try{
  //   // if(!accessToken || !refreshToken) throw("err")
  //   const {data,tokenPair} = await getUser(at,rt);
  //   if(tokenPair){
  //     saveTokenToCookie("access",tokenPair.accessToken,req,res)
  //     saveTokenToCookie("refresh",tokenPair?.refreshToken,req,res)
  //   }
  // }catch(e){
  //   // console.log("error")
  // }
  res.status(200).json({ name: 'John Doe' })
}
