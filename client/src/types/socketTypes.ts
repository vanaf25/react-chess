import {UserType} from "./authTypes";
import {BoardData, FigureColorType} from "./types";
export interface GAME_OPTIONS {
    time:number,
    extraTime:number,
    type:string,
    color:FigureColorType
}
export interface GAME_IS_CREATE {
    id:string,
    gameOptions:GAME_OPTIONS,
    user:OPPONENT,
    board?:BoardData,
    messages:Array<Message>
}
export interface AVAILABLE_USER{
    socketId:string,
    gameOptions:GAME_OPTIONS,
    user:UserType
}
export interface OPPONENT{
    socketId:string,
    user:UserType
}
export interface Message{
    id:string,
    message:string,
    user:UserType
}
