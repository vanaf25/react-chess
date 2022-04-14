import React, {useCallback} from 'react'
import styles from "../Board.module.css";
import {FigureType} from "../Board";
import {posFigureType} from "../../../types/types";
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {dropFigure, setMovingCell } from '../../../store/reducers/boardReducer';
import {checkCordIsEqual} from "../../../store/utils";
export const Cell:React.FC<{cord:posFigureType,
    isBlack:boolean,figure:FigureType | null}>=React.memo(({cord, figure,isBlack})=>{
    const dispatch=useAppDispatch();
    const currentMoving=useAppSelector(state => state.board.currentMove);
    const currentCheck=useAppSelector(state => state.board.currentCheck)
    const isCellAvailable=useAppSelector(state => state.board.availableCells)
        .find(cell=>checkCordIsEqual(cell,cord))
    console.log("isCellAvaible:",isCellAvailable)
    const ondragFigure=()=>{
        if (figure?.color===currentMoving){
            dispatch(setMovingCell({cord:cord,figure:figure}));
        }
    }
    const onDrop=()=>{
            dispatch(dropFigure({cord:cord,figure:figure}))
    }
    return (
        <div  data-x={cord.x} data-y={cord.y}
              onDrop={onDrop}
              onDragOver={(e)=>e.preventDefault()}
              className={`${isCellAvailable?.type==="capture" ? styles.isCanBeDeleted:""} ${styles.board__cell} ${ isBlack ? styles._black:""}
               ${currentCheck.x===cord.x && currentCheck.y===cord.y ? styles.check:"" }`}>
            {isCellAvailable && !isCellAvailable.type && <div className={styles.available}/>}
            { figure?.icon  && <img src={figure.icon.default} onDragStart={ondragFigure} draggable={currentMoving===figure?.color}
                     className={styles.cell__icon} alt={`${figure.color}_${figure.name}`}/>
            }
        </div>
    )
})
