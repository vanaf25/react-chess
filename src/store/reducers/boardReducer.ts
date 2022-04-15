import {Board, Cell, FigureColorType, posFigureType} from "../../types/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkCordIsEqual} from "../utils";
import {checkIsMoveCorrect} from "../../rules/globalRules";

const initialState={
    board:[] as Board,
    movingCell:{

    } as Cell,
    availableCells:[] as Array<posFigureType & {type?:any }>,
    currentMove:FigureColorType.WHITE as FigureColorType,
    currentCheck:{

    } as posFigureType,
    popup:{
        opening:false,
        type:FigureColorType.WHITE as FigureColorType,
        cords:{} as posFigureType
    }
}
const setToLocalStorage=(board:Board,currentMove:FigureColorType)=>localStorage.setItem('board',JSON.stringify({board,currentMove}));
 const boardSlice=createSlice({
    name:"board",
    initialState,
    reducers:{
        dropFigure:(state,action:PayloadAction<Cell>)=>{
            //@ts-ignore
            state.board=state.board.map((cell,index)=>{
                        if (checkCordIsEqual(cell.cord,action.payload.cord)){
                            let type:any=checkIsMoveCorrect(state.movingCell,action.payload,state.board)
                            const figure=type?.startCell?.figure
                            if (type){
                                state.currentMove=state.currentMove===FigureColorType.WHITE ? FigureColorType.BLACK:FigureColorType.WHITE
                                if (type?.type==="castling"){
                                    state.board.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.endCord)){
                                            cell.figure=figure
                                        }
                                        else if (checkCordIsEqual(cell.cord,type?.startCell.cord)){
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
                                        if (checkCordIsEqual(cell.cord,type?.cords)){
                                            cell.figure=null
                                        }
                                    })
                                }
                                else if (type?.action==="setEnPassant"){
                                    state.board.forEach(cell=>{
                                        if (checkCordIsEqual(cell.cord,type?.cords)){
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
                                    if (cell.figure && !checkCordIsEqual(cell.cord,type?.cords)){
                                        cell.figure.enPassant=false
                                    }
                                })
                                return {...cell,
                                    figure:{...state.movingCell.figure,
                                        isFigureHasMoved:true}}
                            }
                        }
                return cell
            });
            state.availableCells=[]
            setToLocalStorage(state.board,state.currentMove);
        },
        setBoard:(state,action:PayloadAction<Board>)=>{
            state.availableCells=[]
            state.board=action.payload
        },
        setMovingCell:(state,action:PayloadAction<Cell>)=>{
            state.movingCell=action.payload
            state.availableCells=[]
            state.board.forEach(el=>{
                const check:any=checkIsMoveCorrect(state.movingCell,el,state.board)
                if (check){
                  if (!state.availableCells.find(cell=>checkCordIsEqual(cell,el.cord))){
                      if (typeof check==="object"){
                          state.availableCells.push({...el.cord,type:check.type})
                      }
                      state.availableCells.push(el.cord);
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
        }
    }
});
export const {setBoard,dropFigure,setMovingCell,setCurrentMoving,setFigureToCell}=boardSlice.actions
export default boardSlice
