import { NextApiRequest, NextApiResponse } from "next"
import { getTokenFromCookie } from "../../../../helpers/tokens"
import { searchUserV1 } from "../../../../twitter/backend"

export default async function helper(req : NextApiRequest, res: NextApiResponse){
    const keywords = (req.query["keywords"] as string).split(",")
    console.log(keywords)
    const accessToken = getTokenFromCookie("access",req,res)
    const refreshToken = getTokenFromCookie("refresh",req,res)
    if(!accessToken || !refreshToken) return res.status(404).json({msg:"tokens not found"})
    const temp = await searchUserV1(accessToken,refreshToken,keywords)
    res.json({})
}