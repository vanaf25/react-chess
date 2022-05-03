import React from 'react';
import styles from './Side.module.css'
import {useAppDispatch, useAppSelector} from "../../store/store";
import {nextVersion, prevVersion, setBoard, setCurrentMoving} from "../../store/reducers/boardReducer";
import createBoard from "../CreateBoard";
import {FigureColorType} from "../../types/types";
import Timer from "../Timer/Timer";
import classnames from 'classnames';
const Side = () => {
    const currentMove=useAppSelector(state => state.board.currentMove);
    const boardLength=useAppSelector(state => state.board.board).length
    const currentVersionOfBoard=useAppSelector(state => state.board.currentVersionOfBoard);
    console.log(currentVersionOfBoard);
    const mate=useAppSelector(state => state.board.mate)
    const dispatch=useAppDispatch();
    const clearTheBoard=()=>{
        localStorage.clear()
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
                <button disabled={currentVersionOfBoard===0}  className={classnames({
                    [styles.disabled]:currentVersionOfBoard===0,
                        [styles.clear]:true
                }

                )}
                        onClick={()=>dispatch(prevVersion())}>Prev</button>
                <button className={styles.clear} onClick={clearTheBoard}>Clear</button>
                <button disabled={currentVersionOfBoard===boardLength}
                        className={classnames({
                            [styles.clear]:true,
                            [styles.disabled]:currentVersionOfBoard===boardLength-1
                        })} onClick={()=>dispatch(nextVersion())}>Next</button>
            </div>
            <Timer type={FigureColorType.BLACK}/>
            <Timer type={FigureColorType.WHITE}/>
        </div>
    );
};

export default Side;
