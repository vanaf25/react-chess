import {Board, Cell, FigureColorType, FigureType} from "../types/types";
import {checkCellsForFigure} from "./globalRules";
import {isCellOccupiedByRival, isEnPassantMove} from "../store/utils";

export const checkMoveForPawn=(startCell:Cell,endCell:Cell,board:Board)=>{
    const figure=startCell.figure as FigureType
    const startCord=startCell.cord
    const endCord=endCell.cord
    const availableRows=[]
    const pawnDirection=figure?.color===FigureColorType.BLACK ? 1:-1
    const rowForPassant=pawnDirection===1 ? 3:4
    if (!figure.isFigureHasMoved){
      availableRows.push(pawnDirection * 2)
    }
        availableRows.push(pawnDirection)
    for (let i=0;i<availableRows.length;i++){
        const row=availableRows[i]
        if (startCord.y-endCord.y===row){
             if (row===1*pawnDirection && (startCord.x-endCord.x===1 || startCord.x-endCord.x===-1)){
                 if (endCell.figure!==null && figure.color!==endCell.figure?.color){
                     if (endCord.y===(pawnDirection===1 ? 0:7)) return {type:"capture",action:"transformation"}
                     return {type:"capture"}
                 }
                 //взятие на проходе
                 else if (rowForPassant===startCord.y && isEnPassantMove(board,
                     {x:endCord.x,y:startCord.y},figure?.color)){
                     return {action: "passant",cords:{x:endCord.x,y:startCord.y}}
                 }
             }
             else if (startCord.x-endCord.x===0 &&  checkCellsForFigure(startCell,endCell,board)){
                 if (row===1*pawnDirection) return true
                 if (row===2*pawnDirection)return {action: "setEnPassant",cords:startCord }
                 if (endCord.y===(pawnDirection===1 ? 0:7)) return {action:"transformation"}
                 return true
             }
        }
    }
}
