import {CreateFigure} from "./CreateFigure";
import {Board, Cell as CellType, FigureColorType, FiguresNameType, posFigureType} from "../types/types";

function returnNameOfFigure(y:number,x:number) {
    if (y===6) return new CreateFigure(FiguresNameType.PAWN, FigureColorType.BLACK)
    else if (y===1) return new CreateFigure(FiguresNameType.PAWN, FigureColorType.WHITE)
     if (y===7 || y===0){
        const color=y===7 ? FigureColorType.BLACK:FigureColorType.WHITE;
        if (x==0 || x===7) return  new CreateFigure(FiguresNameType.ROOK, color)
         if (x===1 || x===6)  return new CreateFigure(FiguresNameType.KNIGHT, color)
         if(x===2 || x==5)  return new CreateFigure(FiguresNameType.BISHOP, color)
        else if (x===3)  return new CreateFigure(FiguresNameType.QUEEN, color)
       else if (x===4)  return new CreateFigure(FiguresNameType.KING, color)
    }
        return null
}
let x=0
let y=7
function createBoard() {
    x=0
    y=7
    const board=[] as Board
    for (let i=0;i<64;i++){
        board.push(new Cell({x,y},returnNameOfFigure(y,x)));
        x++
        if (x===8){
            x=0
            y--
        }
    }
    return [board]
}
class Cell implements CellType{
     cord:posFigureType
    figure:CreateFigure | null
    color:FigureColorType
    constructor(cord:posFigureType,figure:CreateFigure | null) {
        this.cord=cord
        this.color=cord.y%2===1 ? cord.x%2===0 ? FigureColorType.WHITE
            : FigureColorType.BLACK:cord.x%2===0 ? FigureColorType.BLACK:FigureColorType.WHITE
        this.figure=figure
    }
}
export default createBoard
