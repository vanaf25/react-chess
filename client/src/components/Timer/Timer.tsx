import React, {useEffect, useState} from 'react';
import classes from "./Timer.module.css";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setMateByTime, setTime, stopGame} from '../../store/reducers/boardReducer';
import {FigureColorType} from "../../types/types";

const Timer:React.FC<{type:FigureColorType}> = ({type}) => {
    const minutesToTime=(milliseconds:number)=>{
        const seconds=Math.floor(milliseconds/1000)
       let minutes:string | number=Math.floor(seconds/60)
       let restSeconds:string | number=seconds-minutes*60
        if (minutes<10) minutes=`0${minutes}`
        if (restSeconds<10) restSeconds=`0${restSeconds}`
        if (+minutes===0 && +restSeconds<10){
            return `${minutes}:${restSeconds}.${Math.floor((milliseconds-+restSeconds*1000)/100)}`
        }
       return `${minutes}:${restSeconds}`
    }
    const dispatch=useAppDispatch();
    const initialTime=useAppSelector(state => state.board.timer)[type]
    const [currentTime,setCurrentTime]=useState(initialTime)
    if (initialTime===0){
        dispatch(setMateByTime(type))
    }
    const currentMove=useAppSelector(state => state.board.currentMove);
    const extraTime=useAppSelector(state => state.board.extraTime);
    useEffect(()=>{
        if (currentMove!==type && currentMove)    dispatch(setTime([type,initialTime+extraTime]))
    },[currentMove]);
    const mate=useAppSelector(state => state.board.mate);
    const [timeInterval,setTimeInterval]=useState<any>(null);
    useEffect(()=>{
            if (type===currentMove && currentMove){
                setTimeInterval(setInterval(()=>{
                    setCurrentTime(prevState =>{
                        dispatch(setTime([type,prevState-100]))
                        return prevState-100
                    })
                },100));
            }
    },[currentMove])
    if (mate){
        clearInterval(timeInterval)
    }
    useEffect(()=>{
        if (type!==currentMove) clearInterval(timeInterval)
    },[currentMove])
    useEffect(()=>{
        return ()=>{
            dispatch(setTime([type,0]))
            dispatch(stopGame())
        }
    },[])
    return (
        <div className={classes.timer}>
            <h1>{minutesToTime(initialTime)}</h1>
        </div>
    );
};

export default Timer;
