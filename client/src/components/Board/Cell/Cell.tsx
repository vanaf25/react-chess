import React from 'react'
import styles from "../Board.module.css";
import {FigureColorType, FiguresNameType, FigureType, posFigureType} from "../../../types/types";
import {useAppDispatch, useAppSelector} from "../../../store/store";
import {dropFigure, setMovingCell } from '../../../store/reducers/boardReducer';
import {checkCordIsEqual} from "../../../store/utils";
import classnames from 'classnames';
export const Cell:React.FC<{
    color:FigureColorType
    cord:posFigureType,
   figure:FigureType | null}>=React.memo(({cord,color, figure})=>{
    const dispatch=useAppDispatch();
    const mate=useAppSelector(state => state.board.mate);
    const currentMoving=useAppSelector(state => state.board.currentMove);
    const isCellAvailable=useAppSelector(state => state.board.availableCells)
        .find(cell=>checkCordIsEqual(cell,cord))
    const checks=useAppSelector(state => state.board.checks)
    const {cord:activeCord}=useAppSelector(state => state.board.movingCell)
    const ondragFigure=()=>{
        if (!mate){
            if (isCellAvailable) dispatch(dropFigure({cord:cord,figure:figure,color:color}))
            if ((figure?.color===currentMoving || (!currentMoving && figure?.color===FigureColorType.WHITE))  && availableColor===figure?.color){
                dispatch(setMovingCell({cord:cord,figure:figure,color}));
            }
        }
    }
    const onDrop=()=>{
            dispatch(dropFigure({cord:cord,figure:figure,color}))
    }
    const isCheck=figure && figure?.name===FiguresNameType.KING && checks[figure?.color];
    const availableColor=useAppSelector(state => state.board.availableColor);
    return (
        <div data-color={color}  onClick={ondragFigure}  data-x={cord.x} data-y={cord.y}
              onDrop={onDrop}
              onDragOver={(e)=>e.preventDefault()}
              className={classnames({
                  [styles.check]:isCheck,
                  [styles.isCanBeDeleted]:isCellAvailable?.type==="capture",
                  [styles.board__cell]:true,
                  [styles._black]:color===FigureColorType.BLACK,
                  [styles._white]:color===FigureColorType.WHITE,
                  [styles._active]:checkCordIsEqual(activeCord,cord)
              })}>
            {isCellAvailable && !isCellAvailable.type && <div className={styles.available}/>}
            {isCellAvailable?.type==="castling" && <div className={styles.castling}/>}
            { figure?.icon  && <img src={figure.icon} onDragStart={ondragFigure}
                                    draggable={mate ? false:availableColor===figure?.color && currentMoving===figure?.color}
                     className={styles.cell__icon} alt={`${figure.color}_${figure.name}`}/>
            }
        </div>
    )
})
