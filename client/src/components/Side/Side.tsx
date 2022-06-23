import React, {useEffect, useState} from 'react';
import styles from './Side.module.css'
import {useAppDispatch, useAppSelector} from "../../store/store";
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import ThumbDownOffAltOutlinedIcon from '@mui/icons-material/ThumbDownOffAltOutlined';
import {FigureColorType} from "../../types/types";
import Timer from "../Timer/Timer";
import {ACTIONS, socket} from "../Main/Main";
import {setEndOfTheGame} from '../../store/reducers/boardReducer';
import classnames from 'classnames';

const Side = () => {
    const mate=useAppSelector(state => state.board.mate)
    const dispatch=useAppDispatch();
    const opponent=useAppSelector(state => state.board.opponent)
    const opponentSocketId=useAppSelector(state => state.board.opponentSocketId);
    const [isDrawOffering,setIsDrawOffering]=useState(false)
    const [isDrawOfferingSent,setIsDrawOfferingSent]=useState(false)
    const offerADraw=()=>{
      socket.emit(ACTIONS.SET_OFFER_FOR_DRAW,opponent.socketId);
        setIsDrawOfferingSent(true);
    }
    const availableColor=useAppSelector(state => state.board.availableColor);
    useEffect(()=>{
        socket.on(ACTIONS.OFFER_FOR_DRAW,()=>{
            setIsDrawOffering(true);
        })
        socket.on(ACTIONS.REJECT_OFFER_FOR_DRAW,()=>{
            setIsDrawOfferingSent(false)
        })
        socket.on(ACTIONS.ACCEPT_OFFER_FOR_DRAW,()=>{
          dispatch(setEndOfTheGame("draw"))
            setIsDrawOfferingSent(false)
        })
        socket.on(ACTIONS.GIVE_UP,()=>{
            dispatch(setEndOfTheGame(availableColor===FigureColorType.WHITE ?  "black was give up":"white was give up"))
        })
    },[]);
    const rejectOfferForDraw=()=>{
        socket.emit(ACTIONS.SET_REJECT_OFFER_FOR_DRAW,opponent.socketId)
        setIsDrawOffering(false);
    }
    const acceptOfferForDraw=()=>{
        socket.emit(ACTIONS.SET_ACCEPT_OFFER_FOR_DRAW,opponent.socketId)
        setIsDrawOffering(false);
        dispatch(setEndOfTheGame("draw"));
    }
    const giveUp=()=>{
        console.log(opponentSocketId)
        socket.emit(ACTIONS.GIVE_UP,opponentSocketId);
        dispatch(setEndOfTheGame(availableColor===FigureColorType.WHITE ? "white was give up":'black was give up'));
    }
    const colors=[]
    if (availableColor===FigureColorType.WHITE){
        colors.push(FigureColorType.BLACK)
        colors.push(FigureColorType.WHITE)
    }
    else{
        colors.push(FigureColorType.WHITE)
        colors.push(FigureColorType.BLACK)
    }
    return (
        <div className={styles.container}>
            {mate && <h2 className={styles.title}> {mate==="stalemate" || mate==="draw"
            || mate==="white lost by the time"
            || mate==="black lost by the time" || mate==="black was give up" || mate==="white was give up" ? mate:`Mate for ${mate}!!!` }</h2>}
            <Timer type={colors[0]}/>
            <div className={styles.buttons}>
                <button  disabled={!!mate} className={classnames({
                        [styles.button]:true,
                    [styles.disabled]:!!mate,
                })} onClick={offerADraw}>offer a draw</button>
                <button disabled={!!mate} className={classnames({
                    [styles.button]:true,
                    [styles.disabled]:!!mate,
                })} onClick={giveUp}>Give up</button>
            </div>
            {isDrawOffering && <p><ThumbDownOffAltOutlinedIcon
                onClick={rejectOfferForDraw}
                cursor={"pointer"} color={"error"} /> {opponent.name} is offer a draw
                <ThumbUpOutlinedIcon onClick={acceptOfferForDraw} cursor={"pointer"} color={"success"} /> </p> }
            {isDrawOfferingSent && <p>Offer for draw was sended</p>}
            <Timer type={colors[1]}/>
        </div>
    );
};

export default Side;
