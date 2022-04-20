import {Board, Cell, Checks, FiguresNameType} from "../types/types";
import {checkCordIsEqual} from "../store/utils";
import {checkMoveForPawn} from "./pawnRules";
import {knightRules} from "./knightRules";
import {checkMoveForKing} from "./kingRules";
export const checkIsMoveCorrect=(startCell:Cell,endCell:Cell,board:Board,checks?:Checks)=>{
    const figure=startCell?.figure

    if (figure?.color!==endCell.figure?.color){
        switch (figure?.name) {
            case FiguresNameType.PAWN:
                return checkMoveForPawn(startCell,endCell,board);
            case FiguresNameType.KNIGHT:
                return knightRules(startCell,endCell,board)
            case FiguresNameType.BISHOP:{
                return checkCellsForFigure(startCell,endCell,board);
            }
            case FiguresNameType.ROOK:{
                return   checkCellsForFigure(startCell,endCell,board);
            }
            case FiguresNameType.QUEEN:{
                return checkCellsForFigure(startCell,endCell,board);
            }
            case FiguresNameType.KING:{
                return checkMoveForKing(startCell,endCell,board,checks);
            }
        }
    }

}
 export const checkCellsForFigure=(startCell:Cell,endCell:Cell,board:Board,permission?:boolean)=>{
    const getCellByCoords=(x:number,y:number)=>board.filter(cell=>cell.cord.x===x && cell.cord.y===y)
    const movingFigure=startCell?.figure
    let startX=startCell.cord.x
    let endX=endCell.cord.x
    let startY=startCell.cord.y
    let endY=endCell.cord.y
    const checkForFigures=(type:number)=>{
        while (startX!==endX || startY!==endY){
            if (movingFigure?.name===FiguresNameType.QUEEN || movingFigure?.name===FiguresNameType.BISHOP
                || movingFigure?.name===FiguresNameType.KING){
                if (type===1){
                    startX++
                    startY++
                }
                else if (type===2){
                    startX--
                    startY++
                }
                else if (type===3){
                    startX++
                    startY--
                }
                else if (type===4){
                    startX--
                    startY--
                }
            }
            if (movingFigure?.name===FiguresNameType.QUEEN || movingFigure?.name===FiguresNameType.KING ||
                movingFigure?.name===FiguresNameType.ROOK || movingFigure?.name===FiguresNameType.PAWN){
                if (type===5) startX--
                else if (type===6) startX++
                else if (type===7) startY--
                else if (type===8) startY++
            }
            const currentCell=getCellByCoords(startX,startY)[0]
            if (currentCell?.figure!==null){
                if (movingFigure?.name===FiguresNameType.PAWN) return  false
                if (currentCell?.figure.color!==startCell?.figure?.color &&
                    checkCordIsEqual(currentCell?.cord,endCell.cord ) ) return {type:"capture"}
                return false

            }
            else {
                if (checkCordIsEqual(currentCell?.cord,endCell.cord)) return true
            }
        }
    }
    if (startX<endX && startY<endY) return checkForFigures(1)
    else if (startX>endX && startY<endY) return checkForFigures(2)
    else if (startX<endX && startY>endY) return checkForFigures(3)
    else if (startX>endX && startY>endY) return checkForFigures(4)
    else if (startX>endX && startY===endY) return checkForFigures(5)
    else if (startX<endX && startY===endY) return  checkForFigures(6)
    else if (startX===endX && startY>endY) return checkForFigures(7)
    else if (startX===endX && startY<endY) return checkForFigures(8)
}
