import React, {useEffect, useState} from 'react';
import {Box, CardContent, Tab, Tabs, Typography} from "@mui/material";
import {useAppDispatch, useAppSelector} from "../../store/store";
import { startGame } from '../../store/reducers/boardReducer';
import { useNavigate } from 'react-router-dom';
import {io} from "socket.io-client";
import {UserType} from "../../types/authTypes";
import {FigureColorType} from "../../types/types";
interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}
const options={
    "force new connection":true,
    reconnectionAttemptsInfinity:"INFINITY",
    timeout:10000,
    transports:["websocket"],
    autoConnect:false
}
export const socket = io("http://localhost:8080",options);
function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}
function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}
export const ACTIONS={
    START_SEARCHING:"START_SEARCHING",
    GET_AVAILABLE_USERS:"GET_AVAILABLE_USERS",
    CREATE_GAME_WITH_USER:"CREATE_GAME_WITH_USER",
    GAME_IS_CREATE:"GAME_IS_CREATE",
    SET_MOVING:"SET_MOVING",
    CHANGE_BOARD:"CHANGE_BOARD",
    STOP_SEARCHING:"STOP_SEARCHING"
}
interface availableUserType {
    user:UserType,
    time:number,
    extraTime:number,
    type:number
}
const Main = () => {
    const typeOfGames=[
        {
            id:1,
            type:"Bullet",
            time:1,
            extraSeconds:0
        },
        {
            id:2,
            type:"Bullet",
            time:2,
            extraSeconds:1
        },
        {
            id:3,
            type:"Blitz",
            time:3,
            extraSeconds:0
        },
        {
            id:4,
            type:"Blitz",
            time:3,
            extraSeconds:2
        },
        {
            id:4,
            type:"Blitz",
            time:5,
            extraSeconds:0
        },
        {
            id:4,
            type:"Blitz",
            time:5,
            extraSeconds:3
        },
        {
            id:4,
            type:"Rapid",
            time:10,
            extraSeconds:0
        },
        {
            id:4,
            type:"Rapid",
            time:10,
            extraSeconds:5
        },
        {
            id:4,
            type:"Rapid",
            time:10,
            extraSeconds:5
        },
        {
            id:4,
            type:"Rapid",
            time:15,
            extraSeconds:10
        },
        {
            id:4,
            type:"Classical",
            time:30,
            extraSeconds:0
        },
        {
            id:4,
            type:"Classical",
            time:30,
            extraSeconds:20
        },
    ]
    const dispatch=useAppDispatch();
    const navigator=useNavigate();
    const isAuth=useAppSelector(state => state.auth.isAuth)
    if (!isAuth) navigator("/login");
    const user=useAppSelector(state => state.auth.user)
    const [availableUsers,setAvailableUsers]=useState<Array<availableUserType>>([]);
    const [isSearchingForGame,setIsSearchingForGame]=useState<null | number>(null)
    const setTypeOfGame=(time:number,extraTime:number,type:string,color?:FigureColorType,socketId?:string)=>{
        dispatch(startGame({time,extraTime,type,color,socketId}))
        navigator("/game");
    }
    const [value, setValue] = React.useState(0);
    useEffect(()=>{
       socket.connect();
        socket.on(ACTIONS.GET_AVAILABLE_USERS,(data)=>{
            setAvailableUsers(data);
        });
        socket.on(ACTIONS.GAME_IS_CREATE,(data)=>{
            setTypeOfGame(data.user.time,data.user.extraTime,data.user.type,data.color,data.user.socketId)
        })
        socket.on("disconnect",()=>{
            socket.emit(ACTIONS.STOP_SEARCHING,socket.id);
        })
    },[]);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };
    const addAvailableUser=(time:number,extraTime:number,type:string,index:number)=>{
        setIsSearchingForGame(prevState =>prevState!==index ? index:null)
        socket.emit(ACTIONS.START_SEARCHING,{
            socketId:socket.id,
         time,
         extraTime,
         type,
            user
        })
    }
    const createGameWithUser=(user:availableUserType)=>{
        socket.emit(ACTIONS.CREATE_GAME_WITH_USER,{mySocketId:socket.id,user})
    }
    return (
        <div className={"container"}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs centered value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Quick start" {...a11yProps(0)} />
                    <Tab label="Waiting hall" {...a11yProps(1)} />
                </Tabs>
            </Box>
            <TabPanel value={value} index={0}>
                <Box sx={{display:"flex",flexWrap:"wrap",width:610,margin:"0 auto",justifyContent:"center"}}>
                    {typeOfGames.map((typeOfGame,index)=><CardContent
                                                              onClick={()=>addAvailableUser(typeOfGame.time,typeOfGame.extraSeconds,typeOfGame.type,index)}
                                                              sx={{
                                                                  opacity:isSearchingForGame!==null ? index!==isSearchingForGame ? 0.2:1:1,
                                                                  bgcolor: 'text.secondary',
                        textAlign:"center",width:150,color:"#fff",margin:"10px",
                             transform:`scale(${isSearchingForGame===index ? 1.2:1})`,
                        fontSize:"30px",
                        cursor:"pointer",
                        transition:"opacity .3s",
                        "&:hover":{
                            bgcolor:"info.main",
                            opacity:"0.7"
                        }
                    }} key={typeOfGame.id}>
                        <Box>
                            {typeOfGame.time}+{typeOfGame.extraSeconds}
                        </Box>
                        <Box>
                            {typeOfGame.type}
                        </Box>
                    </CardContent>)}
                </Box>
            </TabPanel>
            <TabPanel value={value} index={1}>
                {
                    availableUsers.map(user=>{
                        return <Box onClick={()=>createGameWithUser(user)}  sx={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
                            <Box>
                                {user.user.name}
                            </Box>
                            <Box>
                                {`${user.time}+${user.extraTime}`}
                            </Box>
                            <Box>
                                {`${user.type}`}
                            </Box>
                       </Box>
                    })
                }
            </TabPanel>
        </div>
    )
};

export default Main;
