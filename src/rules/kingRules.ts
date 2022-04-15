import {Board, Cell, FigureColorType} from "../types/types";
import {checkCellsForFigure} from "./globalRules";
import {getCellByCoords} from "../store/utils";

export const checkMoveForKing=(startCell:Cell,endCell:Cell,board:Board)=>{
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
    else if (startCell.figure?.isFigureHasMoved===false){
        const yCell=startCell.figure?.color===FigureColorType.BLACK ? 7 :0
        const distanceForRook=endCord.x===6 ? 1:2
        const rookCell=getCellByCoords(board,distanceForRook===1 ? 7:0,yCell);
        if ((endCell.cord.x===6 || endCell.cord.x===2 )
            && endCell.cord.y===yCell && rookCell.figure?.isFigureHasMoved===false && rookCell.figure?.color===startCell.figure.color){
            return checkCellsForFigure(startCell,endCell,board) ? {type:"castling",startCell:rookCell,
                endCord:{x:endCell.cord.x-(distanceForRook===1 ? 1:-1),y:yCell}}:false
        }
    }
}
