import React, {useEffect} from 'react'
import styles from './Board.module.css'
import {Cell} from "./Cell/Cell";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setBoard, setChecks, setCurrentMoving, setVersionOfBoard} from '../../store/reducers/boardReducer';
import createBoard from "../CreateBoard";
import Popover from "../Popover/Popover";
import {FigureColorType} from "../../types/types";
import { useNavigate } from 'react-router-dom';
import {io} from 'socket.io-client'
import {ACTIONS, socket} from "../Main/Main";
export const Board:React.FC=()=>{
    const navigate=useNavigate();
    const isAuth=useAppSelector(state => state.auth.isAuth)
    if (!isAuth) navigate("/login");
    const availableColor=useAppSelector(state => state.board.availableColor);
    const user=useAppSelector(state => state.auth.user)
    const board=useAppSelector(state =>state.board.board)
    const currentMove=useAppSelector(state => state.board.currentMove);
    const isGameStarted=useAppSelector(state =>state.board.isGameStarted)
    const dispatch=useAppDispatch();
    useEffect(()=>{
        if (localStorage.getItem('board')!==null){
            const board=JSON.parse(localStorage.getItem('board') as string);
            dispatch(setBoard(board.board))
            dispatch(setCurrentMoving(board.currentMove))
            dispatch(setChecks({checks:board.checks,mate:board.mate}))
            dispatch(setVersionOfBoard(board.currentVersionOfBoard))
        }
        else {
            dispatch(setBoard(createBoard()))
        }
    },[]);
    useEffect(()=>{
        if (socket.connected){
            socket.on(ACTIONS.CHANGE_BOARD,(data)=>{
                console.log('change');
                dispatch(setBoard(data.board))
                dispatch(setCurrentMoving(data.currentMove))
                dispatch(setChecks({checks:data.checks,mate:data.mate}))
            })
        }
    },[]);
    return (
        <div className={`${styles.board}  ${availableColor===FigureColorType.BLACK ? styles._blackMoving:"" }`}>
            {isGameStarted && <>
                <Popover/>
                {
                    board?.map((cell)=>{
                        return  <Cell color={cell.color}
                                      figure={cell.figure}
                                      key={Math.random()+Math.random()}   cord={cell.cord}/>
                    })
                }
            </>}


        </div>
    )
}
