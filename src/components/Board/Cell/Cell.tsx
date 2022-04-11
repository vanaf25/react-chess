import React from 'react'
import styles from "../Board.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {FigureType} from "../Board";
import {posFigureType} from "../../../types/types";
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {dropFigure, setMovingCell } from '../../../store/reducers/boardReducer';
export const Cell:React.FC<{cord:posFigureType,
    isBlack:boolean,figure:FigureType | null,available:boolean }>=({cord, figure,isBlack,available})=>{
    const cellRef=React.createRef<HTMLDivElement>();
    const dispatch=useAppDispatch();
    const currentMoving=useAppSelector(state => state.board.currentMove);
    const currentCheck=useAppSelector(state => state.board.currentCheck)
    const ondragFigure=()=>{
        if (figure?.color===currentMoving){
            dispatch(setMovingCell({cord:cord,figure:figure,available}));
        }
    }
    const onDrop=()=>{
            dispatch(dropFigure({cord:cord,figure:figure,available}))
    }
    return (
        <div  data-x={cord.x} data-y={cord.y}
              onDrop={onDrop} onDragOver={(e)=>e.preventDefault()}
              ref={cellRef}
              className={`${styles.board__cell} ${ isBlack ? styles._black:""}
               ${currentCheck.x===cord.x && currentCheck.y===cord.y ? styles.check:"" }`}>
            {available && <div className={styles.available}/>}
            { figure?.icon  && <span  onDragStart={ondragFigure} draggable={currentMoving===figure?.color}><FontAwesomeIcon style={{filter:"brightness(200%)"}}    color={figure.color}   icon={figure.icon} /></span> }
        </div>
    )
}
