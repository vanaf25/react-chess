import React, {useEffect} from 'react'
import styles from './Board.module.css'
import {Cell} from "./Cell/Cell";
import {useAppDispatch, useAppSelector} from "../../store/store";
import { setBoard, setChecks, setCurrentMoving } from '../../store/reducers/boardReducer';
import createBoard from "../CreateBoard";
import Popover from "../Popover/Popover";
export const Board:React.FC=()=>{
    const board=useAppSelector(state =>state.board.board)
    const dispatch=useAppDispatch();
    useEffect(()=>{
        if (localStorage.getItem('board')!==null){
            const board=JSON.parse(localStorage.getItem('board') as string);
            dispatch(setBoard(board.board))
            dispatch(setCurrentMoving(board.currentMove))
            dispatch(setChecks({checks:board.checks,mate:board.mate}))
        }
        else {
            dispatch(setBoard(createBoard()))
        }
    },[]);
    let index=0
    return (
        <div className={styles.board}>
            <Popover/>
            {
                board.map((cell)=>{
                    index++
                    if (index%9===0) index++
                   return  <Cell figure={cell.figure} key={Math.random()+Math.random()} isBlack={index%2===0}  cord={cell.cord}/>
                })
            }
        </div>
    )
}
