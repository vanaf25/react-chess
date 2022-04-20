import {Board, Cell, FigureColorType, FigureType, posFigureType} from "../types/types";
export const getCellByCoords=(board:Board,x:number,y:number)=>board.filter(cell=>cell.cord.x===x && cell.cord.y===y)[0]
export const checkCordIsEqual=(firstCord:posFigureType,secondCord:posFigureType)=>firstCord?.y===secondCord?.y
    && firstCord?.x===secondCord?.x
export const isCellOccupied=(board:Board,cord:posFigureType)=>!!board.find(
    cell=>checkCordIsEqual(cell.cord,cord) && cell.figure!==null
)
export const isCellOccupiedByRival=(board:Board,cord:posFigureType,color:FigureColorType)=>!!board.find(
    cell=>checkCordIsEqual(cell.cord,cord) && cell.figure!==null && cell.figure.color!==color
)
export const isEnPassantMove=(board:Board,cord:posFigureType,color:FigureColorType)=>!!board.find(
    cell=>{
        cell.figure?.enPassant && console.log(cell.figure?.enPassant)
        return checkCordIsEqual(cell.cord,cord) && cell.figure!==null &&
            cell.figure.color!==color && cell.figure.enPassant
    }
)
export const checkFiguresForColor=(firstFigure:FigureType | null,secondFigure:FigureType | null)=>firstFigure?.color!==secondFigure?.color
