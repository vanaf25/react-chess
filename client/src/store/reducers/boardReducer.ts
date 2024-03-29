import Timer, {
    Board,
    Cell,
    Changes,
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
import {ACTIONS, socket} from "../../components/Main/Main";
import {GAME_IS_CREATE, Message} from "../../types/socketTypes";
import {UserType} from "../../types/authTypes";
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
    currentMove: "" as FigureColorType,
    popup:{
        opening:false,
        type:FigureColorType.WHITE as FigureColorType,
        cords:{} as posFigureType,
        color:FigureColorType.WHITE as  FigureColorType
    },
    changes:[] as Changes,
    checks:{
        "white":false,
        "black":false
    },
    mate:'' as Mate,
    extraTime:0,
    isGameStarted:false,
    currentVersionOfBoard:0,
    availableColor:"",
    opponentSocketId:"",
    gameId:"",
    opponent:{} as UserType,
    timer:{
        "white":-1,
        "black":-1
    },
    messages:[] as Array<Message>,
}
const setToLocalStorage=(board:Array<Cell>,
                         currentMove:FigureColorType,
                         checks:Checks,mate:Mate,
                         currentVersionOfBoard:number,changes:Changes,)=>3
 const boardSlice=createSlice({
    name:"board",
    initialState,
    reducers: {
        dropFigure: (state, action: PayloadAction<Cell>) => {
            let isMoveCorrect;
            const changes = [] as Array<Cell>
            //@ts-ignore
            state.board = state.board.map((cell) => {
                if (checkCordIsEqual(cell.cord, action.payload.cord)) {
                    if (cell.figure) {
                        if (state.checks[cell.figure.color] && cell.figure.name !== FiguresNameType.KING) {
                            return cell
                        }
                    }
                    const type = state.availableCells.find(availableCell => checkCordIsEqual(
                        cell.cord, {x: availableCell.x, y: availableCell.y}))
                    if (type) {
                        changes.push({
                            ...cell,
                            figure: {...state.movingCell.figure, isFigureHasMoved: true} as FigureType
                        })
                        isMoveCorrect = true
                        state.currentVersionOfBoard += 1
                        state.currentMove = state.currentMove === FigureColorType.WHITE || !state.currentMove ? FigureColorType.BLACK : FigureColorType.WHITE
                        if (type?.type === "castling") {
                            const figure = type?.startCell?.figure
                            state.board.forEach(cell => {
                                if (checkCordIsEqual(cell.cord, type?.endCord as posFigureType)) {
                                    cell.figure = figure as FigureType
                                    changes.push(cell)
                                } else if (checkCordIsEqual(cell.cord, type?.startCell?.cord as posFigureType)) {
                                    cell.figure = null
                                    changes.push(cell)
                                }
                            })
                        } else if (type?.action === "transformation") {
                            state.popup = {
                                opening: true,
                                type: state.movingCell?.figure?.color as FigureColorType,
                                color: cell.color as FigureColorType,
                                cords: cell.cord
                            }
                        } else if (type?.action === "passant") {
                            state.board.forEach(cell => {
                                if (checkCordIsEqual(cell.cord, type?.cords as posFigureType)) {
                                    cell.figure = null
                                }
                            })
                        } else if (type?.action === "setEnPassant") {
                            state.board.forEach(cell => {
                                if (checkCordIsEqual(cell.cord, type?.cords as posFigureType)) {
                                    if (cell.figure) {
                                        cell.figure.enPassant = true
                                    }
                                }
                            })
                        }
                        //clear the moved cell
                        state.board.forEach(cell => {
                            if (checkCordIsEqual(cell.cord, state.movingCell.cord)) {
                                cell.figure = null
                            }
                            if (cell.figure !== null &&
                                cell.figure.name === FiguresNameType.PAWN &&
                                !checkCordIsEqual(cell.cord, type?.cords as posFigureType)) {
                                cell.figure.enPassant = false
                            }
                        })
                        return {...cell, figure: {...state.movingCell.figure, isFigureHasMoved: true}}
                    }
                }
                return cell
            })
            //проверка на шаx
            if (isMoveCorrect) {
                state.checks = isCheck(state.board, state.checks)
            }
            //проверка на мат
            if (state.checks[state.currentMove]) {
                if (isMate(state.board, state.currentMove, state.checks)) {
                    state.mate = state.currentMove
                }
            }
            //проверка на пат
            if (!state.checks[state.currentMove]) {
                if (isMate(state.board, state.currentMove, state.checks)) {
                    state.mate = "stalemate"
                }
            }
            if (isMoveCorrect) {
                if (checkForDraw(state.board)) {
                    state.mate = "draw"
                }
            }
            if (state.availableColor && isMoveCorrect && state.opponentSocketId) {
                socket.emit(ACTIONS.SET_MOVING, {
                    to: state.opponentSocketId,
                    board: state.board,
                    checks: state.checks,
                    mate: state.mate,
                    currentMove: state.currentMove,
                    timer:state.timer,
                    gameId: state.gameId
                })
            }
            if (state.mate) localStorage.removeItem("gameId");
            state.availableCells = []
            state.changes.push(changes)
            setToLocalStorage(state.board, state.currentMove, state.checks, state.mate, state.currentVersionOfBoard, state.changes);
            state.movingCell = {} as Cell
        },
        setBoard: (state, action: PayloadAction<Board | Array<Board>>) => {
            state.availableCells = []
            //@ts-ignore
            state.board = action.payload
            state.checks = {
                "white": false,
                "black": false
            }
            state.movingCell = {} as Cell
            state.mate = "" as FigureColorType
            state.currentVersionOfBoard = 0
        },
        setMovingCell: (state, action: PayloadAction<Cell>) => {
            state.movingCell = action.payload
            state.availableCells = []
            state.board.forEach(el => {
                const type: any = checkIsMoveCorrect(state.movingCell, el, state.board, state.checks)
                if (type) {
                    let isMoveCorrect = false
                    let imitationBoard: Board = JSON.parse(JSON.stringify(state.board))
                    //@ts-ignore
                    imitationBoard = imitationBoard.map((cell) => {
                        if (checkCordIsEqual(cell.cord, el.cord)) {
                            if (type) {
                                isMoveCorrect = true
                                if (type?.type === "castling") {
                                    const figure = type?.startCell?.figure
                                    imitationBoard.forEach(cell => {
                                        if (checkCordIsEqual(cell.cord, type?.endCord as posFigureType)) {
                                            cell.figure = figure as FigureType
                                        } else if (checkCordIsEqual(cell.cord, type?.startCell?.cord as posFigureType)) {
                                            cell.figure = null
                                        }
                                    })
                                } else if (type?.action === "passant") {
                                    imitationBoard.forEach(cell => {
                                        if (checkCordIsEqual(cell.cord, type?.cords as posFigureType)) {
                                            cell.figure = null
                                        }
                                    })
                                } else if (type?.action === "setEnPassant") {
                                    imitationBoard.forEach(cell => {
                                        if (checkCordIsEqual(cell.cord, type?.cords as posFigureType)) {
                                            if (cell.figure) {
                                                cell.figure.enPassant = true
                                            }

                                        }
                                    })
                                }
                                //clear the moved cell
                                imitationBoard.forEach(cell => {
                                    if (checkCordIsEqual(cell.cord, state.movingCell.cord)) {
                                        cell.figure = null
                                    }
                                    if (cell.figure !== null
                                        && cell.figure.name === FiguresNameType.PAWN
                                        && cell.figure.enPassant
                                        && !checkCordIsEqual(cell.cord, type?.cords as posFigureType)) {
                                        debugger;
                                        cell.figure.enPassant = false
                                    }
                                })
                                return {...cell, figure: {...state.movingCell.figure, isFigureHasMoved: true}}
                            }
                        }
                        return cell
                    });
                    if (isMoveCorrect) {
                        if (state.movingCell.figure && !isCheck(imitationBoard, state.checks)[state.movingCell.figure.color]) {
                            if (!state.availableCells.find(cell => checkCordIsEqual(cell, el.cord))) {
                                if (typeof type === "object") {
                                    state.availableCells.push({
                                        ...el.cord,
                                        type: type.type,
                                        action: type.action,
                                        startCell: type?.startCell,
                                        endCord: type?.endCord,
                                        cords: type?.cords
                                    })
                                }
                                state.availableCells.push(el.cord);
                            }
                        }
                    }
                }
            })
        },
        setCurrentMoving: (state, action: PayloadAction<FigureColorType>) => {
            state.currentMove = action.payload
        },
        setFigureToCell: (state, action: PayloadAction<Cell>) => {
            state.popup = {...state.popup, opening: false}
            //@ts-ignore
            state.board = state.board.map(cell => {
                if (checkCordIsEqual(cell.cord, action.payload.cord)) {
                    state.currentVersionOfBoard += 1
                    return {...cell, figure: action.payload.figure}
                }
                return cell
            })

            const currentBoard = state.board
            state.checks = isCheck(currentBoard, state.checks)
            if (state.checks[state.currentMove]) {
                if (isMate(currentBoard, state.currentMove, state.checks)) {
                    state.mate = state.currentMove
                }
            }
            //проверка на пат
            if (!state.checks[state.currentMove]) {
                if (isMate(currentBoard, state.currentMove, state.checks)) {
                    state.mate = "stalemate"
                }
            }
            if (checkForDraw(currentBoard)) {
                state.mate = "draw"
            }
            if (state.availableColor && state.opponentSocketId) {
                socket.emit(ACTIONS.SET_MOVING, {
                    to: state.opponentSocketId,
                    board: state.board,
                    checks: state.checks,
                    mate: state.mate,
                    currentMove: state.currentMove
                })
            }
        },
        setChecks: (state, action: PayloadAction<{ checks: Checks, mate: FigureColorType | "stalemate" }>) => {
            state.checks = action.payload.checks
            state.mate = action.payload.mate
        },
        setMateByTime: (state, action: PayloadAction<FigureColorType>) => {
            if (action.payload === FigureColorType.WHITE) {
                state.mate = `white lost by the time`
            } else if (action.payload === FigureColorType.BLACK) {
                state.mate = `black lost by the time`
            }
            localStorage.removeItem("gameId")
        },
        startGame: (state, action: PayloadAction<GAME_IS_CREATE>) => {
            state.isGameStarted = true;
            const gameOptions = action.payload.gameOptions
            const user = action.payload.user
            const boardData = action.payload.board
            state.extraTime = gameOptions.extraTime * 1000
            state.timer = {
                "white": gameOptions.time * 60 * 1000,
                "black": gameOptions.time * 60 * 1000
            }
            state.availableColor = gameOptions.color
            state.opponentSocketId = user.socketId
            state.opponent = user.user
            state.gameId = action.payload.id
            if (boardData) {
                state.board = boardData.board
                state.checks = boardData.checks
                state.mate = boardData.mate
                state.currentMove = boardData.currentMove
            }
            state.messages=action.payload.messages
            localStorage.setItem('gameId', action.payload.id);
        },
        stopGame: (state) => {
            state.extraTime = 0;
            state.availableColor = ""
        },
        setEndOfTheGame: (state, action: PayloadAction<Mate>) => {
            state.mate = action.payload
        },
        setTime: (state, action: PayloadAction<Array<any> | Timer>) => {
            if (Array.isArray(action.payload)){
                // @ts-ignore
                state.timer[action.payload[0]]=action.payload[1]
            }
            else{state.timer =action.payload}


        },
        setOpponentSocketId:(state ,action:PayloadAction<string>)=>{
            state.opponentSocketId=action.payload
        },
        setMessage:(state,action:PayloadAction<Message>)=>{
            state.messages=[...state.messages,action.payload]
        }
    }
});
export const {setBoard,dropFigure,setMovingCell,setCurrentMoving,
    setFigureToCell,setChecks,setMateByTime,startGame,stopGame,setEndOfTheGame,setTime,setOpponentSocketId,setMessage}=boardSlice.actions
export default boardSlice
