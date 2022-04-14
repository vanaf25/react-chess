import React from 'react';
import styles from './Side.module.css'
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setBoard, setCurrentMoving} from "../../store/reducers/boardReducer";
import createBoard from "../CreateBoard";
const Side = () => {
    const currentMove=useAppSelector(state => state.board.currentMove);
    const dispatch=useAppDispatch();
    const clearTheBoard=()=>{
        localStorage.removeItem('board');
        dispatch(setBoard(createBoard()));
        dispatch(setCurrentMoving("white"))
    }
    const prevHandler=()=>{

    }
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Current Move: {currentMove}</h2>
            <div className={styles.buttons}>
                <button className={styles.clear} onClick={prevHandler}>Prev</button>
                <button className={styles.clear} onClick={clearTheBoard}>Clear</button>
                <button className={styles.clear} onClick={clearTheBoard}>Next</button>
            </div>

        </div>
    );
};

export default Side;
