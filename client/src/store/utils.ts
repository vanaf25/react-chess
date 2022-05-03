import {Board, FigureColorType, FiguresNameType, FigureType, posFigureType} from "../types/types";

export const getCellByCoords=(board:Board,x:number,y:number)=>board.filter(cell=>cell.cord.x===x && cell.cord.y===y)[0]
export const checkCordIsEqual=(firstCord:posFigureType,secondCord:posFigureType)=>firstCord?.y===secondCord?.y
    && firstCord?.x===secondCord?.x
export const isCellOccupiedByRival=(board:Board,cord:posFigureType,color:FigureColorType)=>!!board.find(
    cell=>checkCordIsEqual(cell.cord,cord) && cell.figure!==null && cell.figure.color!==color
)
export const isEnPassantMove=(board:Board,cord:posFigureType,color:FigureColorType)=>!!board.find(
    cell=>{
        return checkCordIsEqual(cell.cord,cord) && cell.figure!==null &&
            cell.figure.color!==color && cell.figure.enPassant
    }
)
export const countOfFiguresByColor=(board:Board,names:Array<FiguresNameType>,
                                    figureColor:FigureColorType)=>{
    const colors=[] as Array<FigureColorType>
    return  board.filter(cell=>{
        if (cell.figure){
            if (names.includes(cell.figure.name)){
                if (cell.figure.name===FiguresNameType.BISHOP){
                  if (colors.includes(cell.color)) return false
                  else {
                      colors.push(cell.color)
                      return true
                  }
                }
                return true
            }
        }
    }).length
}
export const checkFiguresForColor=(firstFigure:FigureType | null,secondFigure:FigureType | null)=>firstFigure?.color!==secondFigure?.color
