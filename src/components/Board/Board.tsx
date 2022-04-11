import React, {useEffect} from 'react'
import styles from './Board.module.css'
import {Cell} from "./Cell/Cell";
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import {useAppDispatch, useAppSelector} from "../../store/store";
import { setBoard, setCurrentMoving } from '../../store/reducers/boardReducer';
import createBoard from "../CreateBoard";
export type FigureType={
    id:number,
    name:string,
    color:string,
    isFigureHasMoved?:boolean
    icon:IconDefinition | undefined | null,
}
export  type FiguresNameType="pawn" | "rook" | "knight" | "bishop" | "queen" | "king"
export const Board:React.FC=()=>{
    const board=useAppSelector(state =>state.board.board)
    const dispatch=useAppDispatch();
    useEffect(()=>{
        if (localStorage.getItem('board')!==null){
            const board=JSON.parse(localStorage.getItem('board') as string);
            console.log(board);
            dispatch(setBoard(board.board))
            dispatch(setCurrentMoving(board.currentMove))
        }
        else {
            dispatch(setBoard(createBoard()))
        }

    },[]);
    let index=0
    return (
        <div className={styles.board}>
            {
                board.map((cell)=>{
                    index++
                    if (index%9===0) index++
                   return  <Cell available={cell.available} figure={cell.figure} key={Math.random()+Math.random()} isBlack={index%2===0}  cord={cell.cord}/>
                })
            }
        </div>
    )
}
