import {Board, Cell, Checks, FigureColorType, FiguresNameType, FigureType, posFigureType} from "../../types/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkCordIsEqual, checkFiguresForColor} from "../utils";
import {checkIsMoveCorrect} from "../../rules/globalRules";
import isCheck, {isMate} from "../../rules/checkForCheck";
import {log} from "util";

type Type={
    type?:string,
    action?:string,
    startCell?:Cell,
    endCord?:posFigureType,
    cords?:posFigureType,
}
const initialState={
    board:[] as Board,
    movingCell:{

    } as Cell,
    availableCells:[] as Array<posFigureType & Type>,
    currentMove:FigureColorType.WHITE as FigureColorType,
    popup:{
        opening:false,
        type:FigureColorType.WHITE as FigureColorType,
        cords:{} as posFigureType
    },
    checks:{
        "white":false,
        "black":false
},
    mate:'' as FigureColorType | "stalemate"
}
const setToLocalStorage=(board:Board,currentMove:FigureColorType,checks:Checks,mate:FigureColorType | "stalemate")=>localStorage.setItem('board',
    JSON.stringify({board,currentMove,checks,mate}));
 const boardSlice=createSlice({
    name:"board",
    initialState,
    reducers:{
        dropFigure:(state,action:PayloadAction<Cell>)=>{
            let isMoveCorrect;
        //@ts-ignore
           state.board=state.board.map((cell)=>{
                        if (checkCordIsEqual(cell.cord,action.payload.cord)){
                            if (cell.figure){
                                if (state.checks[cell.figure.color] && cell.figure.name!==FiguresNameType.KING){
                                    return cell
                                }
                            }
                            const type=state.availableCells.find(availableCell=>checkCordIsEqual(
                                cell.cord,{x:availableCell.x,y:availableCell.y}))
                            if (type){
                                isMoveCorrect=true
                                state.currentMove=state.currentMove===FigureColorType.WHITE ? FigureColorType.BLACK:FigureColorType.WHITE
                                if (type?.type==="castling"){
                                    const figure=type?.startCell?.figure
                                    state.board.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.endCord as posFigureType )){
                                            cell.figure=figure as FigureType
                                        }
                                        else if (checkCordIsEqual(cell.cord,type?.startCell?.cord as posFigureType)){
                                            cell.figure=null
                                        }
                                    })
                                }
                                else if (type?.action==="transformation"){
                                    state.popup={opening:true,
                                        type:state.movingCell?.figure?.color as FigureColorType,
                                        cords:cell.cord
                                    }
                                }
                                else if (type?.action==="passant"){
                                    state.board.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.cords as posFigureType )){
                                            cell.figure=null
                                        }
                                    })
                                }
                                else if (type?.action==="setEnPassant"){
                                    state.board.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.cords as posFigureType)){
                                            //@ts-ignore
                                            cell.figure.enPassant=true
                                        }
                                    })
                                }
                                //clear the moved cell
                                state.board.forEach(cell=>{
                                    if (checkCordIsEqual(cell.cord,state.movingCell.cord)){
                                        cell.figure=null
                                    }
                                    if (cell.figure!==null && !checkCordIsEqual(cell.cord,type?.cords as posFigureType)){
                                        cell.figure.enPassant=false
                                    }
                                })
                               return {...cell,figure:{...state.movingCell.figure,isFigureHasMoved:true}}
                            }
                        }
                        return cell
            });
            //проверка на шаx
           if (isMoveCorrect){
             state.checks=isCheck(state.board,state.checks)
           }
           //проверка на мат
            if (state.checks[state.currentMove]){
                if (isMate(state.board,state.currentMove,state.checks)){
                    state.mate=state.currentMove
                }
            }
            //проверка на пат
            if (!state.checks[state.currentMove]){
                if (isMate(state.board,state.currentMove,state.checks)){
                    state.mate="stalemate"
                }
            }
            state.availableCells=[]
            setToLocalStorage(state.board,state.currentMove,state.checks,state.mate);
           state.movingCell={} as Cell
        },
        setBoard:(state,action:PayloadAction<Board>)=>{
            state.availableCells=[]
            state.board=action.payload
            state.checks={
                "white":false,
                "black":false
            }
            state.movingCell={} as Cell
            state.mate="" as FigureColorType
        },
        setMovingCell:(state,action:PayloadAction<Cell>)=>{
            state.movingCell=action.payload
            state.availableCells=[]
            state.board.forEach(el=>{
                const type:any=checkIsMoveCorrect(state.movingCell,el,state.board,state.checks)
                if (type){
                    let isMoveCorrect=false
                    let imitationBoard:Board=JSON.parse(JSON.stringify(state.board))
                    //@ts-ignore
                     imitationBoard=imitationBoard.map((cell)=>{
                        if (checkCordIsEqual(cell.cord,el.cord)){
                            if (type){
                                isMoveCorrect=true
                                if (type?.type==="castling"){
                                    const figure=type?.startCell?.figure
                                    imitationBoard.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.endCord as posFigureType )){
                                            cell.figure=figure as FigureType
                                        }
                                        else if (checkCordIsEqual(cell.cord,type?.startCell?.cord as posFigureType)){
                                            cell.figure=null
                                        }
                                    })
                                }
                                else if (type?.action==="passant"){
                                    imitationBoard.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.cords as posFigureType )){
                                            cell.figure=null
                                        }
                                    })
                                }
                                else if (type?.action==="setEnPassant"){
                                    imitationBoard.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.cords as posFigureType)){
                                            if (cell.figure){
                                                cell.figure.enPassant=true
                                            }

                                        }
                                    })
                                }
                                //clear the moved cell
                                imitationBoard.forEach(cell=>{
                                    if (checkCordIsEqual(cell.cord,state.movingCell.cord)){
                                        cell.figure=null
                                        console.log(cell.figure)
                                    }
                                    if (cell.figure!==null && !checkCordIsEqual(cell.cord,type?.cords as posFigureType)){
                                        cell.figure.enPassant=false
                                    }
                                })
                                return {...cell,figure:{...state.movingCell.figure,isFigureHasMoved:true}}
                            }
                        }
                        return cell
                    });
                    if (isMoveCorrect){
                        if (state.movingCell.figure && !isCheck(imitationBoard,state.checks)[state.movingCell.figure.color]){
                            if (!state.availableCells.find(cell=>checkCordIsEqual(cell,el.cord))){
                                if (typeof type==="object"){
                                    state.availableCells.push({...el.cord,type:type.type,
                                        action:type.action,startCell:type?.startCell,endCord:type?.endCord,cords:type?.cords})
                                }
                                state.availableCells.push(el.cord);
                            }
                        }
                    }
                }
            })
        },
        setCurrentMoving:(state,action:PayloadAction<FigureColorType>)=>{
            state.currentMove=action.payload
        },
        setFigureToCell:(state,action:PayloadAction<Cell>)=>{
            state.popup={...state.popup,opening:false}
            state.board=state.board.map(cell=>{
                if (checkCordIsEqual(cell.cord,action.payload.cord)){
                    return {...cell,figure:action.payload.figure}
                }
                return cell
            })
            state.checks=isCheck(state.board,state.checks)
        },
        setChecks:(state,action:PayloadAction<{checks:Checks,mate:FigureColorType | "stalemate"}>)=>{
            state.checks=action.payload.checks
            state.mate=action.payload.mate
        }
    }
});
export const {setBoard,dropFigure,setMovingCell,setCurrentMoving,setFigureToCell,setChecks}=boardSlice.actions
export default boardSlice
