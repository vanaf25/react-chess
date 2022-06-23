import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {UserTypeWithTokens} from "../../types/authTypes";
import {logOut, setError, setUserData } from '../reducers/authReducer';
const BASE_URL="http://localhost:5000/api"
export const loginApi=createApi({
    reducerPath: "loginApi",
    baseQuery: fetchBaseQuery({baseUrl: BASE_URL,headers:{
            authorization:`Bearer ${localStorage.getItem('accessToken')}`,
        },
        credentials:"include"
    }),
    tagTypes: ['Post'],
    endpoints: (builder) => ({
        registration: builder.mutation<UserTypeWithTokens,Omit<FormData, "repeatPassword">>({
            query: (body) => ({
                method: "POST",
                url: `registration`,
                body
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                try {
                    const user=await queryFulfilled
                    console.log(user);
                    dispatch(setUserData(user.data))
                }
                catch (e) {
                    if (e?.error?.status===400){
                        dispatch(setError(e?.error?.data.message))
                    }
                    console.log(e);
                }
            },
            invalidatesTags: ['Post'],
        }),
        isAuth:builder.query<UserTypeWithTokens,number>({
            query:()=>({
                url:"/refresh"
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                try {
                    const user=await queryFulfilled
                    console.log(user);
                    dispatch(setUserData(user.data))
                }
               catch (e) {
                   console.log(e);
               }
            }
        }),
        login:builder.mutation<UserTypeWithTokens,Omit<FormData, "repeatPassword" | "email">>({
            query:(body)=>({
                method:"POST",
                url:"/login",
                body
            }),
            invalidatesTags: ['Post'],
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                try {
                    const user=await queryFulfilled
                    console.log(user);
                    dispatch(setUserData(user.data))
                }
                catch (e) {
                    console.log(e);
                }
            }
        }),
        logOut:builder.mutation<string,void>({
            query:()=>({
                method:"DELETE",
                url:"/logout"
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                const logout=await  queryFulfilled
                if (logout){
                    dispatch(logOut())
                }
            }
        })
    })
})
export const {useRegistrationMutation,useIsAuthQuery,useLoginMutation,useLogOutMutation}=loginApi
