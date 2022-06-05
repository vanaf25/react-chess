import {Server} from "socket.io";
import express from 'express'
import cors from 'cors'
import {v1, v4} from 'uuid'
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
    STOP_SEARCHING: "STOP_SEARCHING",
    SET_OFFER_FOR_DRAW:"SET_OFFER_FOR_DRAW",
    OFFER_FOR_DRAW:"OFFER_FOR_DRAW",
    REJECT_OFFER_FOR_DRAW:"REJECT_OFFER_FOR_DRAW",
    SET_REJECT_OFFER_FOR_DRAW:"SET_REJECT_OFFER_FOR_DRAW",
    SET_ACCEPT_OFFER_FOR_DRAW:"SET_ACCEPT_OFFER_FOR_DRAW",
    ACCEPT_OFFER_FOR_DRAW:"ACCEPT_OFFER_FOR_DRAW",
    SET_GIVE_UP:"SET_GIVE_UP",
    GIVE_UP:"GIVE_UP",
    OPPONENT_DISCONNECT:"OPPONENT_DISCONNECT",
    RECONNECT_FOR_GAME: "RECONNECT_FOR_GAME",
    SEND_MESSAGE:"SEND_MESSAGE"
}
const PORT=process.env.WS_PORT || 8080
let availableUsers=[];
const games=[

]
io.on("connection",(socket)=>{
    const createGameWithUser=({mySocketId,user,opponent,gameOptions,opponentSocketId})=>{
        const isOpponent=availableUsers.find(user=>user.socketId===opponentSocketId)
        if (isOpponent){
            const idOfTheGame=v1();
            const colors=["white","black"].sort(()=>Math.random()-0.5)
            availableUsers=availableUsers.filter(availableUser=>availableUser.socketId!==opponentSocketId
                && availableUser.socketId!==mySocketId)
            io.to(opponentSocketId).emit(ACTIONS.GAME_IS_CREATE,{
                user:{socketId:mySocketId,user:user}
                ,id:idOfTheGame, messages:[],gameOptions:{color:colors[0],...gameOptions}});
            io.to(mySocketId).emit(ACTIONS.GAME_IS_CREATE,
                {user:{user:opponent,socketId:opponentSocketId},messages:[],id:idOfTheGame,gameOptions:{color:colors[1],...gameOptions}});
            games.push({id:idOfTheGame,
                    users:[{socketId:mySocketId,user,color:colors[1]},
                    {socketId:opponentSocketId,user:opponent,color: colors[0]}],
                    gameOptions:gameOptions,
                    board:{},
                    messages:[]
            }
                )
        }
    }
    const filterUsersBySocketId=(id)=>availableUsers.filter(availableUser=>availableUser.socketId!==id)
    socket.on(ACTIONS.STOP_SEARCHING,(id)=>{
        availableUsers=filterUsersBySocketId(id);
        io.emit(ACTIONS.GET_AVAILABLE_USERS,availableUsers)
    })
    socket.on(ACTIONS.START_SEARCHING,(data)=>{
        let isUserFind;
        availableUsers=availableUsers.filter(availableUser=>availableUser.user.name!==data.user.name)
        availableUsers.forEach(user=>{
            if (user.gameOptions.time===data.gameOptions.time && user.gameOptions.extraTime===data.gameOptions.extraTime){
                isUserFind=true
                createGameWithUser({mySocketId:data.socketId,
                    user:data.user,opponent:user.user,gameOptions:user.gameOptions,opponentSocketId:user.socketId})
            }
        })
        if (!isUserFind){
            availableUsers.push(data);
            io.emit(ACTIONS.GET_AVAILABLE_USERS,availableUsers)
        }
    })
    socket.on(ACTIONS.CREATE_GAME_WITH_USER,(data)=>{
        createGameWithUser(data)
    })
    socket.on(ACTIONS.SET_OFFER_FOR_DRAW,(socketId)=>{
        io.to(socketId).emit(ACTIONS.OFFER_FOR_DRAW)
    })
    socket.on(ACTIONS.SET_MOVING,({to,gameId,...board})=>{
        games.forEach(game=>{
            if (game.id===gameId){
                game.board=board
            }
        })
        io.to(to).emit(ACTIONS.CHANGE_BOARD,board)
    })
    socket.on(ACTIONS.SET_REJECT_OFFER_FOR_DRAW,(socketId)=>{
        io.to(socketId).emit(ACTIONS.REJECT_OFFER_FOR_DRAW)
    })
    socket.on(ACTIONS.SET_ACCEPT_OFFER_FOR_DRAW,(socketId)=>{
        io.to(socketId).emit(ACTIONS.ACCEPT_OFFER_FOR_DRAW)
    })
    socket.on(ACTIONS.SET_GIVE_UP,(socketId)=>{
        io.to(socketId).emit(ACTIONS.GIVE_UP)
    })
    io.emit(ACTIONS.GET_AVAILABLE_USERS,availableUsers)
    socket.on("disconnect",()=>{
        availableUsers=filterUsersBySocketId(socket.id);
        games.forEach(game=>{
            game.users.forEach(user=>{
                if (user.socketId===socket.id){
                    const opponent=game.users.find(user=>user.socketId!==socket.id)
                    if (opponent){
                        io.to(opponent.socketId).emit(ACTIONS.OPPONENT_DISCONNECT)
                    }
                }
            })
        })
        io.emit(ACTIONS.GET_AVAILABLE_USERS,availableUsers);
    })
    socket.on(ACTIONS.RECONNECT_FOR_GAME,({userId,gameId})=>{
        games.forEach(game=>{
            if (game.id===gameId){
                game.users.forEach(user=>{
                    if (user.user.id===userId){
                        user.socketId=socket.id
                        const opponent=game.users.find(user=>user.socketId!==socket.id);
                        if (opponent){
                            io.to(socket.id).emit(ACTIONS.GAME_IS_CREATE,{
                                user:opponent,
                                gameOptions:{...game.gameOptions,color:user.color},
                                board:game.board,
                                id:gameId
                            })
                            io.to(opponent.socketId).emit(ACTIONS.RECONNECT_FOR_GAME,socket.id);
                        }
                    }
                })
            }
        })
    })
    socket.on(ACTIONS.SEND_MESSAGE,({gameId,message})=>{
        games.forEach(game=>{
            if (game.id===gameId){
                message.id=v4()
                game.messages.push(message);
                const opponent=game.users.find(user=>user.socketId!==message.user.socketId);
                if (opponent){
                    io.to(opponent.socketId).emit(ACTIONS.SEND_MESSAGE,message);
                    io.to(message.user.socketId).emit(ACTIONS.SEND_MESSAGE,message);
                }
            }
        })
    })
})
io.listen(PORT);
