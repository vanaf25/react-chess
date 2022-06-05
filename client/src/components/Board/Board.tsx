import React, {useEffect, useState} from 'react'
import styles from './Board.module.css'
import {Cell} from "./Cell/Cell";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setBoard, setChecks, setCurrentMoving, setOpponentSocketId, setTime} from '../../store/reducers/boardReducer';
import createBoard from "../CreateBoard";
import Popover from "../Popover/Popover";
import {FigureColorType} from "../../types/types";
import { useNavigate } from 'react-router-dom';
import {ACTIONS, socket} from "../Main/Main";
import classnames from 'classnames';
export const Board:React.FC=()=>{
    const navigate=useNavigate();
    const isAuth=useAppSelector(state => state.auth.isAuth)
    if (!isAuth) navigate("/login");
    const availableColor=useAppSelector(state => state.board.availableColor);
    const user=useAppSelector(state => state.auth.user)
    const board=useAppSelector(state =>state.board.board)
    const isGameStarted=useAppSelector(state =>state.board.isGameStarted);
    const opponent=useAppSelector(state => state.board.opponent);
    const mate=useAppSelector(state => state.board.mate);
    const dispatch=useAppDispatch();
    useEffect(()=>{
        if (!board?.length){
            dispatch(setBoard(createBoard()))
        }
    },[]);
    const [isOpponentConnected,setIsOpponentConnected]=useState(true)
    useEffect(()=>{
        if (socket.connected){
            socket.on(ACTIONS.CHANGE_BOARD,(data)=>{
                dispatch(setBoard(data.board))
                dispatch(setCurrentMoving(data.currentMove))
                dispatch(setChecks({checks:data.checks,mate:data.mate}))
                dispatch(setTime(data.timer))
            })
            socket.on(ACTIONS.OPPONENT_DISCONNECT,()=>{
                setIsOpponentConnected(false);
            })
        }
        socket.on(ACTIONS.RECONNECT_FOR_GAME,data=>{
            setIsOpponentConnected(true);
            dispatch(setOpponentSocketId(data))
        })

    },[]);
    useEffect(()=>{
        return ()=>{
            socket.disconnect()
            if (mate){
                localStorage.removeItem("gameId");
            }
        }
    },[mate]);
    return (
        <div>
                {
                    isGameStarted && <div className={styles.board__container}>
                        <div className={styles.user__data}>
                           <div className={classnames({
                               [styles.user__status]:true,
                               [styles.user__status_offline]:!isOpponentConnected
                           })}/>
                             <h2>{opponent.name}</h2>
                        </div>
                        {isGameStarted && <div className={`${styles.board}
            ${availableColor===FigureColorType.BLACK ? styles._blackMoving:"" }`}>
                            <Popover/>
                            {
                                board?.map((cell)=>{
                                    return  <Cell color={cell.color}
                                                  figure={cell.figure}
                                                  key={Math.random()+Math.random()}   cord={cell.cord}/>
                                })
                            }
                        </div>}
                        <div className={styles.user__data}>
                            <div className={classnames({
                                [styles.user__status]:true,
                            })}/>
                            <h2>{user.name}</h2>
                        </div>
                    </div>
                }
        </div>
    )
}
