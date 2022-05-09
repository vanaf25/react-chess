import React, {useEffect, useState} from 'react';
import classes from "./Timer.module.css";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setMateByTime, stopGame} from '../../store/reducers/boardReducer';
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
    const initialTime=useAppSelector(state => state.board.initialTime)
    const timeForLocalStorage:number | null=
        localStorage.getItem(type===FigureColorType.WHITE ? "whiteTimer":"blackTimer") ?
            JSON.parse(localStorage.getItem(type === FigureColorType.WHITE ? "whiteTimer" : "blackTimer") as string):null


    const [currentTime,setCurrentTime]=useState(initialTime);
    window.addEventListener("storage",()=>{
        console.log('change');
        console.log(localStorage.getItem(type===FigureColorType.WHITE ? "whiteTimer":"blackTimer"))
        if (localStorage.getItem(type===FigureColorType.WHITE ? "whiteTimer":"blackTimer")===null){
            setCurrentTime(initialTime);
        }
    })
    if (currentTime===0){
        dispatch(setMateByTime(type))
    }
    const currentTimer=useAppSelector(state => state.board.currentTime)
    const extraTime=useAppSelector(state => state.board.extraTime);
    useEffect(()=>{
        if (currentTimer!==type && currentTimer) setCurrentTime(prevState =>prevState+extraTime);
    },[currentTimer]);
    const mate=useAppSelector(state => state.board.mate);
    const [timeInterval,setTimeInterval]=useState<any>(null);
    useEffect(()=>{
            if (type===currentTimer){
                setTimeInterval(setInterval(()=>{
                    setCurrentTime(prevState =>{
                        localStorage.setItem(type===FigureColorType.WHITE ? "whiteTimer":"blackTimer",
                            JSON.stringify(prevState-100))
                        return prevState-100
                    });

                },100));
            }
    },[currentTimer])
    if (mate){
        clearInterval(timeInterval)
    }
    useEffect(()=>{
        if (type!==currentTimer) clearInterval(timeInterval)
    },[currentTimer])
    useEffect(()=>{
        return ()=>{
            setCurrentTime(0);
            dispatch(stopGame())
        }
    },[])
    return (
        <div className={classes.timer}>
            <h1>{minutesToTime(currentTime)}</h1>
        </div>
    );
};

export default Timer;
