import {Board, Cell} from "../types/types";
import {checkCordIsEqual, getCellByCoords} from "./utils";
export const checkIsMoveCorrect=(startCell:Cell,endCell:Cell,board:Board)=>{
    const startCord=startCell.cord
    const endCord=endCell.cord
    const figure=startCell?.figure
    if (figure?.color!==endCell.figure?.color){
        switch (figure?.name) {
            case "pawn":
                if (figure.color==="black"){
                    if (!figure.isFigureHasMoved){
                        if (startCord.y-endCord.y===2 && startCord.x-endCord.x===0
                            && checkCellsForFigure(startCell,endCell,board)) return  true
                    }
                    if (startCord.y-endCord.y===1 ){
                        if (startCord.x-endCord.x===0 && checkCellsForFigure(startCell,endCell,board))  return true
                        if ((endCord.x===startCord.x+1 || endCord.x===startCord.x-1)
                            && endCell.figure && endCell?.figure?.color!==figure.color) return {type:"capture"}
                    }
                }
                else{
                    if (!figure.isFigureHasMoved){
                        if (startCord.y-endCord.y===-2 &&  startCord.x-endCord.x===0 && checkCellsForFigure(startCell,endCell,board)){
                            return  true
                        }
                    }
                    if (startCord.y-endCord.y===-1){
                        if (startCord.x-endCord.x===0 && checkCellsForFigure(startCell,endCell,board))  return true
                        if ((endCord.x===startCord.x+1 || endCord.x===startCord.x-1)
                            && endCell?.figure && endCell?.figure?.color!==figure.color) return {type:"capture"}
                    }
                }
                break;
            case "knight":
                if (
                    (startCell.cord.y+2===endCord.y && (startCord.x-1===endCord.x || startCord.x+1===endCord.x)) ||
                    (startCell.cord.y-2===endCord.y && (startCord.x-1===endCord.x || startCord.x+1===endCord.x)) ||
                    (startCord.x-2===endCord.x && (startCord.y-1===endCord.y || startCord.y+1===endCord.y)) ||
                    (startCord.x+2===endCord.x && (startCord.y-1===endCord.y || startCord.y+1===endCord.y))
                ){
                    if (endCell.figure?.color) return {type: "capture"}
                    return true
                }
                break;
            case "bishop":{
                return checkCellsForFigure(startCell,endCell,board);
            }
            case "rook":{
                return   checkCellsForFigure(startCell,endCell,board);
            }
            case "queen":{
                return checkCellsForFigure(startCell,endCell,board);
            }
            case "king":{
                return checkMoveForKing(startCell,endCell,board);
            }
        }
    }

}
const checkCellsForFigure=(startCell:Cell,endCell:Cell,board:Board,permission?:boolean)=>{
    console.log(board);
    const getCellByCoords=(x:number,y:number)=>board.filter(cell=>cell.cord.x===x && cell.cord.y===y)
    const movingFigure=startCell?.figure
    let startX=startCell.cord.x
    let endX=endCell.cord.x
    let startY=startCell.cord.y
    let endY=endCell.cord.y
    const checkForFigures=(type:number)=>{
        while (startX!==endX || startY!==endY){
            if (movingFigure?.name==="queen" || movingFigure?.name==="bishop"
                || movingFigure?.name==="king"){
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
            if (movingFigure?.name==="queen" || movingFigure?.name==="king" ||
                movingFigure?.name==="rook" || movingFigure?.name==="pawn"){
                if (type===5) startX--
                else if (type===6) startX++
                else if (type===7) startY--
                else if (type===8) startY++
            }
            const currentCell=getCellByCoords(startX,startY)[0]
            if (currentCell?.figure!==null){
                if (movingFigure?.name==="pawn") return  false
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

const checkMoveForKing=(startCell:Cell,endCell:Cell,board:Board)=>{
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
        const rookCell=getCellByCoords(board,7,0)[0]
        if (endCell.cord.x===6 && endCell.cord.y===0 && rookCell.figure?.isFigureHasMoved===false){
            return checkCellsForFigure(startCell,endCell,board) ? {type:"short castling",startCord:{x:7,y:0},
                endCord:{x:endCell.cord.x-1,y:0}}:false
        }
    }
}
