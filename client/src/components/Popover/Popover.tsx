import React from 'react';
import styles from './Popover.module.css'
import {CreateFigure, images} from "../CreateFigure";
import {useAppDispatch, useAppSelector} from "../../store/store";
import {setFigureToCell} from '../../store/reducers/boardReducer';
import {FigureColorType, FiguresNameType} from "../../types/types";

const Popover = () => {
    const popup=useAppSelector(state => state.board.popup);
    const figures:Array<{id:number,blackImage:string,whiteImage:string,name:FiguresNameType}>=[{
        id:1,
        name:FiguresNameType.BISHOP,
        blackImage:images["black_bishop.png"],
        whiteImage:images["white_bishop.png"]
    },
        {
            id:2,
            name:FiguresNameType.KNIGHT,
            blackImage:images["black_knight.png"],
            whiteImage: images["white_knight.png"]
        },
        {
            id:3,
            name:FiguresNameType.ROOK,
            blackImage: images["black_rook.png"],
            whiteImage: images["white_rook.png"],
        },
        {
            id:4,
            name:FiguresNameType.QUEEN,
            blackImage:images["black_queen.png"],
            whiteImage: images["white_queen.png"]
        }
    ]
    const dispatch=useAppDispatch()
    const onSelect=(name:FiguresNameType)=>{
        const figure=new CreateFigure(name,popup.type);
        dispatch(setFigureToCell({cord:popup.cords,figure,color:popup.color}))
    }
    return (
        <>
            {popup.opening && <div  className={styles.popover}>
                {figures.map(figure=>{
                    return   <img onClick={()=>onSelect(figure.name)}
                                  src={popup.type===FigureColorType.WHITE ? figure.whiteImage:figure.blackImage}
                                  alt={`${popup.type}_${figure.name}`}/>
                })}


            </div>}
        </>

    );
};

export default Popover;
