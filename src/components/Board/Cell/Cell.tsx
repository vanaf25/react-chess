import React from 'react'
import styles from "../Board.module.css";
import {FiguresNameType, FigureType, posFigureType} from "../../../types/types";
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {dropFigure, setMovingCell } from '../../../store/reducers/boardReducer';
import {checkCordIsEqual} from "../../../store/utils";
import classnames from 'classnames';
export const Cell:React.FC<{cord:posFigureType,
    isBlack:boolean,figure:FigureType | null}>=React.memo(({cord, figure,isBlack})=>{
    const dispatch=useAppDispatch();
    const mate=useAppSelector(state => state.board.mate);
    const currentMoving=useAppSelector(state => state.board.currentMove);
    const isCellAvailable=useAppSelector(state => state.board.availableCells)
        .find(cell=>checkCordIsEqual(cell,cord))
    const checks=useAppSelector(state => state.board.checks)
    const {cord:activeCord}=useAppSelector(state => state.board.movingCell)
    const ondragFigure=()=>{
        if (!mate){
            if (isCellAvailable) dispatch(dropFigure({cord:cord,figure:figure}))
            if (figure?.color===currentMoving){
                dispatch(setMovingCell({cord:cord,figure:figure}));
            }
        }
    }
    const onDrop=()=>{
            dispatch(dropFigure({cord:cord,figure:figure}))
    }
    const isCheck=figure && figure?.name===FiguresNameType.KING && checks[figure?.color]
    return (
        <div onClick={ondragFigure}  data-x={cord.x} data-y={cord.y}
              onDrop={onDrop}
              onDragOver={(e)=>e.preventDefault()}
              className={classnames({
                  [styles.check]:isCheck,
                  [styles.isCanBeDeleted]:isCellAvailable?.type==="capture",
                  [styles.board__cell]:true,
                  [styles._black]:isBlack,
                  [styles._active]:checkCordIsEqual(activeCord,cord)
              })}>
            {isCellAvailable && !isCellAvailable.type && <div className={styles.available}/>}
            {isCellAvailable?.type==="castling" && <div className={styles.castling}/>}
            { figure?.icon  && <img src={figure.icon} onDragStart={ondragFigure} draggable={mate ? false:currentMoving===figure?.color}
                     className={styles.cell__icon} alt={`${figure.color}_${figure.name}`}/>
            }
        </div>
    )
})
