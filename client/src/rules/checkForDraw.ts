import {Board, FiguresNameType} from "../types/types";
import {countOfFiguresByColor} from "../store/utils";

export const checkForDraw=(board:Board)=>{
    let isDraw=true;
    board.forEach(cell=>{
        if (cell.figure && isDraw){
            if (cell.figure.name===FiguresNameType.PAWN) isDraw=false
            if (cell.figure.name===FiguresNameType.QUEEN) isDraw=false
            if (cell.figure.name===FiguresNameType.ROOK) isDraw=false
            if (countOfFiguresByColor(board,[FiguresNameType.BISHOP,FiguresNameType.KNIGHT],
                cell.figure.color)>1) isDraw=false
        }
    })
    return isDraw
}
