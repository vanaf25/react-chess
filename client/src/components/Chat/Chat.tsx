import React, {useEffect} from 'react';
import classes from './Chat.module.css'
import {TextField} from "@mui/material";
import {useForm,Controller} from "react-hook-form";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {ACTIONS, socket} from "../Main/Main";
import { setMessage } from '../../store/reducers/boardReducer';
type formData={
    message:string
}
const Chat = () => {
    const {handleSubmit,reset,control}=useForm<formData>()
    const gameId=useAppSelector(state => state.board.gameId)
    const onSubmit=(data:formData)=>{
        if (data.message?.trim()){
            socket.emit(ACTIONS.SEND_MESSAGE,{
                gameId,
                message:{
                    message:data.message,
                    user:{...user,socketId:socket.id}
                }
            })
            reset({message:""})
        }
    }
    const dispatch=useAppDispatch()
    useEffect(()=>{
        if (socket.connected){
            socket.on(ACTIONS.SEND_MESSAGE,data=>{
                console.log(data);
                dispatch(setMessage(data))
            })
        }
    },[])
    const user=useAppSelector(state => state.auth.user)
    const messages=useAppSelector(state => state.board.messages);
    return (
        <div className={classes.chat}>
          <div className={classes.chat__messages}>
              {messages?.map(message=><div key={Math.random()} className={classes.chat__message}>
                  <h3 className={classes.chat__message__user}>{message.user.name}</h3>
                  <div className={classes.chat__message__message}>{message.message}</div>
              </div>)}
          </div>
            <form onSubmit={handleSubmit(onSubmit)} className={classes.chat__form}>
                <Controller control={control} render={({field})=>{
                    return <TextField {...field} fullWidth id="standard-basic" label="Message" variant="standard" />
                }} name={"message"}/>

            </form>
        </div>
    );
};

export default Chat;
