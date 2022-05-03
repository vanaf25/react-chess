import React, {useEffect} from 'react'
import styles from './Board.module.css'
import {Cell} from "./Cell/Cell";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setBoard, setChecks, setCurrentMoving, setVersionOfBoard} from '../../store/reducers/boardReducer';
import createBoard from "../CreateBoard";
import Popover from "../Popover/Popover";
import {FigureColorType} from "../../types/types";
export const Board:React.FC=()=>{
    const board=useAppSelector(state =>state.board.board)
    const currentVersionOfBoard=useAppSelector(state => state.board.currentVersionOfBoard)
    console.log(currentVersionOfBoard)
    const currentMove=useAppSelector(state => state.board.currentMove)
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
    return (
        <div className={`${styles.board} ${currentMove===FigureColorType.BLACK ? styles._blackMoving:"" }`}>
            <Popover/>
            {
                board[currentVersionOfBoard]?.map((cell)=>{
                   return  <Cell color={cell.color}
                                 figure={cell.figure}
                                 key={Math.random()+Math.random()}   cord={cell.cord}/>
                })
            }
        </div>
    )
}
