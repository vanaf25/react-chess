import {Board, Cell, FigureColorType, posFigureType} from "../../types/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkIsMoveCorrect} from "../utils";
import {FigureType} from "../../components/Board/Board";
const initialState={
    board:[] as Board,
    movingCell:{

    } as Cell,
    currentMove:"white" as FigureColorType,
    currentCheck:{
        x:0,
        y:0
    } as posFigureType
}
const setToLocalStorage=(board:Board,currentMove:FigureColorType)=>localStorage.setItem('board',JSON.stringify({board,currentMove}));
 const boardSlice=createSlice({
    name:"board",
    initialState,
    reducers:{
        dropFigure:(state,action:PayloadAction<Cell>)=>{
            //@ts-ignore
            state.board=state.board.map((cell,_,board)=>{
                //trying to find a end moving cell on the desk
                if (cell.cord.x === action.payload.cord.x && cell.cord.y === action.payload.cord.y){
                    if (cell?.figure?.color!==state.movingCell?.figure?.color){
                        if(checkIsMoveCorrect(state.movingCell,cell,state.movingCell.figure as FigureType,board)){
                            state.currentMove=state.currentMove==="white" ? "black":"white"
                            return {...cell,figure:{...state.movingCell.figure,isFigureHasMoved:true},}
                        }
                    }
                }
                //Trying to find a moving figure on the desk
                if (cell.cord.x === state.movingCell.cord.x && cell.cord.y === state.movingCell.cord.y){
                    if (cell?.figure?.color!==action.payload.figure?.color
                        && checkIsMoveCorrect(state.movingCell,action.payload,state.movingCell.figure as FigureType,board) ){
                        return  {...cell,figure:null}
                    }
                }
                return cell
            });
            setToLocalStorage(state.board,state.currentMove);
        },
        setBoard:(state,action:PayloadAction<Board>)=>{
            state.board=action.payload
        },
        setMovingCell:(state,action:PayloadAction<Cell>)=>{
            state.movingCell=action.payload
        },
        setCurrentMoving:(state,action:PayloadAction<FigureColorType>)=>{
            state.currentMove=action.payload
        }
    }
});
export const {setBoard,dropFigure,setMovingCell,setCurrentMoving}=boardSlice.actions
export default boardSlice
