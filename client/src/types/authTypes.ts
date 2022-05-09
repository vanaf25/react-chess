export type UserType={
    id:string,
    name:string,
    email:string,
    isActivated:boolean
}
export type UserTypeWithTokens={
    accessToken:string,
    refreshToken:string,
    user:UserType
}
