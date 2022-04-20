import {Board, Cell, FiguresNameType, posFigureType} from "../types/types";

export const knightRules=(startCell:Cell,endCell:Cell,board:Board)=>{
    const endCord=endCell.cord
    const startCord=startCell.cord
    if (
        (startCord.y+2===endCord.y &&
            (startCord.x-1===endCord.x || startCord.x+1===endCord.x)) ||
        (startCord.y-2===endCord.y && (startCord.x-1===endCord.x || startCord.x+1===endCord.x)) ||
        (startCord.x-2===endCord.x && (startCord.y-1===endCord.y || startCord.y+1===endCord.y)) ||
        (startCord.x+2===endCord.x && (startCord.y-1===endCord.y || startCord.y+1===endCord.y))
    ){
        if (endCell?.figure?.name===FiguresNameType.KING) console.log('check!!')
        if (endCell.figure?.color) return {type: "capture"}
        return true
    }
}
