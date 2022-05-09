import {Server} from "socket.io";
import express from 'express'
import cors from 'cors'
import {v4} from 'uuid'
const io=new Server({
        origin: "*",
        methods: ["GET", "POST"]
})
const app=express()
app.use(cors());
const ACTIONS={
  START_SEARCHING:"START_SEARCHING",
  GET_AVAILABLE_USERS:"GET_AVAILABLE_USERS",
   CREATE_GAME_WITH_USER:"CREATE_GAME_WITH_USER",
    GAME_IS_CREATE:"GAME_IS_CREATE",
    ME:"ME",
    SET_MOVING:"SET_MOVING",
    CHANGE_BOARD:"CHANGE_BOARD",
    STOP_SEARCHING: "STOP_SEARCHING"
}
const PORT=process.env.WS_PORT || 8080
let availableUsers=[];
const games=[

]
io.on("connection",(socket)=>{
    console.log("socket connected");
    socket.on(ACTIONS.STOP_SEARCHING,(id)=>{
        availableUsers=availableUsers.filter(availableUser=>availableUser.socketId!==id)
        io.emit(ACTIONS.GET_AVAILABLE_USERS,availableUsers)
    })
    socket.on(ACTIONS.START_SEARCHING,(data)=>{
        let isUserFind;
        availableUsers=availableUsers.filter(availableUser=>availableUser.user.name!==data.user.name)
        availableUsers.forEach(user=>{
            if (user.time===data.time && user.extraTime===data.extraTime){
                isUserFind=true

            }
        })
        if (!isUserFind){
            availableUsers.push(data);
            io.emit(ACTIONS.GET_AVAILABLE_USERS,availableUsers)
        }
    })
    socket.on(ACTIONS.CREATE_GAME_WITH_USER,({mySocketId,user})=>{
        const socketId=user.socketId
        const opponent=availableUsers.find(user=>user.socketId===socketId)
            if (opponent){
                const idOfTheGame=v4();
                const colors=["white","black"].sort(()=>Math.random()-0.5)
                io.to(socketId).emit(ACTIONS.GAME_IS_CREATE,{user,idOfTheGame,color:colors[0]});
                io.to(mySocketId).emit(ACTIONS.GAME_IS_CREATE,{user:opponent,idOfTheGame,color:colors[1]});
                games.push({id:idOfTheGame,board:{}})
                }
    })

    socket.on(ACTIONS.SET_MOVING,({to,...board})=>{
        io.to(to).emit(ACTIONS.CHANGE_BOARD,board)
    })
    io.emit(ACTIONS.GET_AVAILABLE_USERS,availableUsers)
})
io.listen(PORT);
