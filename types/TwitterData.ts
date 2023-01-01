export default interface TwitterData<T>{
    data : T
    tokenPair : TokenPair | null
}

interface TokenPair{
    accessToken : string
    refreshToken : string
}

export type {TokenPair}