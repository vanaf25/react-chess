import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {UserType, UserTypeWithTokens} from "../../types/authTypes";
const initialState={
    isAuth:false,
    user:{} as UserType,
    error:""
}
 const authSlice=createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUserData:(state,action:PayloadAction<UserTypeWithTokens>)=>{
            localStorage.setItem("accessToken",action.payload.accessToken)
            state.isAuth=true
            state.user=action.payload.user
        },
        logOut:(state)=>{
            state.isAuth=false
            state.user={} as UserType
        },
        setError:(state,action:PayloadAction<string>)=>{
            state.error=action.payload
        }
    }
})
export const {setUserData,logOut,setError}=authSlice.actions
export default authSlice
