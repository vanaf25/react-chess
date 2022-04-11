import React from 'react';
import styles from './Side.module.css'
import {useAppSelector} from "../../store/store";
const Side = () => {
    const currentMove=useAppSelector(state => state.board.currentMove)
    return (
        <div>
            <h2 className={styles.title}>Current Move: {currentMove}</h2>
        </div>
    );
};

export default Side;
