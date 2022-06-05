import {Board, Cell, Checks, FigureColorType} from "../types/types";
import {checkCellsForFigure} from "./globalRules";
import {getCellByCoords} from "../store/utils";
import {checkCellsForAvailableForOpponent} from "./checkForCheck";
export const checkMoveForKing=(startCell:Cell,endCell:Cell,board:Board,checks?:Checks)=>{
    const startCord=startCell.cord
    const endCord=endCell.cord

    if (startCord.x===endCord.x+1 && startCord.y===endCord.y ){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCord.x===endCord.x-1 && startCord.y===endCord.y){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCord.x===endCord.x && startCord.y===endCord.y+1){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCord.x===endCord.x && startCord.y===endCord.y-1){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCord.x===endCord.x+1 && startCord.y===endCord.y+1){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCord.x===endCord.x-1 && startCord.y===endCord.y-1){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCord.x===endCord.x+1 && startCord.y===endCord.y-1){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCord.x===endCord.x-1 && startCord.y===endCord.y+1){
        return checkCellsForFigure(startCell,endCell,board)
    }
    else if (startCell.figure && startCell.figure?.isFigureHasMoved===false && checks && !checks[startCell.figure.color] ){
        const yCell=startCell.figure?.color===FigureColorType.BLACK ? 7 :0
        const distanceForRook=endCord.x===6 ? 1:2
        const rookCell=getCellByCoords(board,distanceForRook===1 ? 7:0,yCell);
        if ((endCell.cord.x===6 || endCell.cord.x===2 )
            && endCell.cord.y===yCell && rookCell.figure?.isFigureHasMoved===false && rookCell.figure?.color===startCell.figure.color){
            const endCellForLong=getCellByCoords(board,endCord.x-1,endCord.y)
            if (!checkCellsForAvailableForOpponent(startCell, endCell,board)){
                return checkCellsForFigure(startCell,distanceForRook===1 ? endCell:endCellForLong,board) ? {type:"castling",startCell:rookCell,
                    endCord:{x:endCell.cord.x-(distanceForRook===1 ? 1:-1),y:yCell}}:false
            }

        }
    }
}
