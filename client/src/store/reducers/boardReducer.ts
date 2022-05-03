import {
    Board,
    Cell,
    Checks,
    FigureColorType,
    FiguresNameType,
    FigureType,
    Mate,
    posFigureType
} from "../../types/types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {checkCordIsEqual} from "../utils";
import {checkIsMoveCorrect} from "../../rules/globalRules";
import isCheck, {isMate} from "../../rules/checkForCheck";
import {checkForDraw} from "../../rules/checkForDraw";

type Type={
    type?:string,
    action?:string,
    startCell?:Cell,
    endCord?:posFigureType,
    cords?:posFigureType,
}
const initialState={
    board:[] as Array<Board>,
    movingCell:{

    } as Cell,
    availableCells:[] as Array<posFigureType & Type>,
    currentMove:FigureColorType.WHITE as FigureColorType,
    currentTime: '' as FigureColorType,
    popup:{
        opening:false,
        type:FigureColorType.WHITE as FigureColorType,
        cords:{} as posFigureType,
        color:FigureColorType.WHITE as  FigureColorType
    },
    checks:{
        "white":false,
        "black":false
},
    mate:'' as Mate,
    initialTime:60000,
    currentVersionOfBoard:0,
}
const getLastVersionOfBoard=(state:any):Board=>state.board[state.board.length ? state.board.length-1:0]
const setToLocalStorage=(board:Array<Board>,
                         currentMove:FigureColorType,
                         checks:Checks,mate:Mate,
                         currentVersionOfBoard:number)=>
    localStorage.setItem('board',
    JSON.stringify({board,currentMove,checks,mate,currentVersionOfBoard}));
 const boardSlice=createSlice({
    name:"board",
    initialState,
    reducers:{
        dropFigure:(state,action:PayloadAction<Cell>)=>{
            let board:Board=JSON.parse(JSON.stringify(getLastVersionOfBoard(state)))
            let isMoveCorrect;
        //@ts-ignore
           state.board=state.board.map((currentBoard,index)=>{
               if (index===state.board.length-1){
                   // @ts-ignore
                   board=board.map(cell=>{
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
                               state.currentVersionOfBoard+=1
                               state.currentMove=state.currentMove===FigureColorType.WHITE ? FigureColorType.BLACK:FigureColorType.WHITE
                               state.currentTime=!state.currentTime ? FigureColorType.BLACK:
                                   state.currentTime===FigureColorType.BLACK ? FigureColorType.WHITE : FigureColorType.BLACK
                               if (type?.type==="castling"){
                                   const figure=type?.startCell?.figure
                                   board.forEach(cell=>{
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
                                       color:cell.color as FigureColorType,
                                       cords:cell.cord
                                   }
                               }
                               else if (type?.action==="passant"){
                                   board.forEach(cell=>{
                                       if (checkCordIsEqual(cell.cord,type?.cords as posFigureType )){
                                           cell.figure=null
                                       }
                                   })
                               }
                               else if (type?.action==="setEnPassant"){
                                   board.forEach(cell=>{
                                       if (checkCordIsEqual(cell.cord,type?.cords as posFigureType)){
                                           //@ts-ignore
                                           cell.figure.enPassant=true
                                       }
                                   })
                               }
                               //clear the moved cell
                               board.forEach(cell=>{
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
                   })
                   return currentBoard

               }
               return currentBoard

            });
           state.board.push(board)
            //проверка на шаx
           if (isMoveCorrect){
             state.checks=isCheck(board,state.checks)
           }
           //проверка на мат
            if (state.checks[state.currentMove]){
                if (isMate(board,state.currentMove,state.checks)){
                    state.mate=state.currentMove
                }
            }
            //проверка на пат
            if (!state.checks[state.currentMove]){
                if (isMate(board,state.currentMove,state.checks)){
                    state.mate="stalemate"
                }
            }
            if (isMoveCorrect){
                if (checkForDraw(board)){
                    state.mate="draw"
                }
            }
            state.availableCells=[]
            setToLocalStorage(state.board,state.currentMove,state.checks,state.mate,state.currentVersionOfBoard);
           state.movingCell={} as Cell
        },
        setBoard:(state,action:PayloadAction<Board | Array<Board>>)=>{
            state.availableCells=[]
            //@ts-ignore
            state.board=action.payload
            state.checks={
                "white":false,
                "black":false
            }
            state.movingCell={} as Cell
            state.mate="" as FigureColorType
            state.currentTime="" as FigureColorType
            state.currentVersionOfBoard=0
        },
        setMovingCell:(state,action:PayloadAction<Cell>)=>{
            state.movingCell=action.payload
            state.availableCells=[]
            const lastBoard=getLastVersionOfBoard(state)
            lastBoard.forEach(el=>{
                const type:any=checkIsMoveCorrect(state.movingCell,el,lastBoard,state.checks)
                if (type){
                    let isMoveCorrect=false
                    let imitationBoard:Board=JSON.parse(JSON.stringify(lastBoard))
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
            //@ts-ignore
            state.board=state.board.map((currentBoard,index)=>{
                if (index===state.board.length-1){
                    return currentBoard.map(cell=>{
                        if (checkCordIsEqual(cell.cord,action.payload.cord)){
                            state.currentVersionOfBoard+=1
                            return {...cell,figure:action.payload.figure}
                        }
                        return cell
                    })
                }

            })
            const currentBoard=getLastVersionOfBoard(state)
            state.checks=isCheck(currentBoard,state.checks)
            if (state.checks[state.currentMove]){
                if (isMate(currentBoard,state.currentMove,state.checks)){
                    state.mate=state.currentMove
                }
            }
            //проверка на пат
            if (!state.checks[state.currentMove]){
                if (isMate(currentBoard,state.currentMove,state.checks)){
                    state.mate="stalemate"
                }
            }
                if (checkForDraw(currentBoard)){
                    state.mate="draw"
                }
        },
        setChecks:(state,action:PayloadAction<{checks:Checks,mate:FigureColorType | "stalemate"}>)=>{
            state.checks=action.payload.checks
            state.mate=action.payload.mate
        },
        setMateByTime:(state,action:PayloadAction<FigureColorType>)=>{
            if (action.payload===FigureColorType.WHITE){
                state.mate=`white lost by the time`
            }
            else if (action.payload===FigureColorType.BLACK){
                state.mate=`black lost by the time`
            }
        },
        prevVersion:(state)=>{
            if (state.currentVersionOfBoard>0){
                state.currentVersionOfBoard-=1
            }
        },
        nextVersion:(state)=>{
            if (state.currentVersionOfBoard<state.board.length){
                state.currentVersionOfBoard+=1
            }
        },
        setVersionOfBoard:(state,action:PayloadAction<number>)=>{
            state.currentVersionOfBoard=action.payload
        }
    }
});
export const {setBoard,dropFigure,setMovingCell,setCurrentMoving,
    setFigureToCell,setChecks,setMateByTime,prevVersion,nextVersion,setVersionOfBoard}=boardSlice.actions
export default boardSlice
