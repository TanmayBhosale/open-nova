import { NextRequest, NextResponse } from "next/server";
import getBaseUrl from "./helpers/getBaseUrl";
import { getTokenFromCookie } from "./helpers/tokens";
import { getUserId } from "./helpers/userId";



export function middleware(req : NextRequest){
    if(!req.cookies.get("open_nova_user_id")){
        return NextResponse.redirect(getBaseUrl()+"/auth")
    }
}

export const config = {
    matcher : ["/app/:path*"]
}