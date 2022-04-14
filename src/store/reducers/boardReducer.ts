import {Board, Cell, FigureColorType, posFigureType} from "../../types/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkIsMoveCorrect} from "../checkMove";
import {checkCordIsEqual} from "../utils";
const initialState={
    board:[] as Board,
    movingCell:{

    } as Cell,
    availableCells:[] as Array<posFigureType & {type?:any }>,
    currentMove:"white" as FigureColorType,
    currentCheck:{

    } as posFigureType,
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
                            const type:any=checkIsMoveCorrect(state.movingCell,action.payload,state.board)
                            if (type){
                                state.currentMove=state.currentMove==="white" ?"black":"white"
                                if (type?.type==="short castling"){
                                    state.board.forEach((cell,el,array)=>{
                                        //@ts-ignore
                                        if (checkCordIsEqual(cell.cord,type?.startCord)){
                                        }
                                    })
                                }
                                return {...cell,
                                    figure:{...state.movingCell.figure,
                                        isFigureHasMoved:true}}
                            }
                        }
                        if (checkCordIsEqual(cell.cord,state.movingCell.cord)){
                            if (checkIsMoveCorrect(state.movingCell,action.payload,state.board)){
                                return {...cell,
                                    figure:null}
                            }
                        }
                return cell


                //trying to find a end moving cell on the desk

                //Trying to find a moving figure on the desk

            });
            state.availableCells=[]
            setToLocalStorage(state.board,state.currentMove);
        },
        setBoard:(state,action:PayloadAction<Board>)=>{
            state.board=action.payload
        },
        setMovingCell:(state,action:PayloadAction<Cell>)=>{
            state.movingCell=action.payload
            console.log('stet')
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

    }
});
export const {setBoard,dropFigure,setMovingCell,setCurrentMoving}=boardSlice.actions
export default boardSlice
