import React from 'react';
import styles from './Side.module.css'
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setBoard, setCurrentMoving} from "../../store/reducers/boardReducer";
import createBoard from "../CreateBoard";
import {FigureColorType} from "../../types/types";
import Timer from "../Timer/Timer";
const Side = () => {
    const currentMove=useAppSelector(state => state.board.currentMove);
    const currentVersionOfBoard=useAppSelector(state => state.board.currentVersionOfBoard);
    console.log(currentVersionOfBoard);
    const mate=useAppSelector(state => state.board.mate)
    const dispatch=useAppDispatch();
    const clearTheBoard=()=>{
        localStorage.removeItem("board");
        localStorage.removeItem("whiteTimer");
        localStorage.removeItem("blackTimer")
        dispatch(setBoard(createBoard()));
        dispatch(setCurrentMoving(FigureColorType.WHITE))
    }
    return (
        <div className={styles.container}>
            {!mate &&  <h2 className={styles.title}>Current Move: {currentMove}</h2>}
            {mate && <h2 className={styles.title}> {mate==="stalemate" || mate==="draw"
            || mate==="white lost by the time"
            || mate==="black lost by the time" ? mate:`Mate for ${mate}!!!` }</h2>}
            <div className={styles.buttons}>
                <button className={styles.clear} onClick={clearTheBoard}>Clear</button>
            </div>
            <Timer type={FigureColorType.BLACK}/>
            <Timer type={FigureColorType.WHITE}/>
        </div>
    );
};

export default Side;
