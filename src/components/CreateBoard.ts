import {CreateFigure} from "./CreateFigure";
import {Board, Cell as CellType, FigureColorType, FiguresNameType, posFigureType} from "../types/types";

function returnNameOfFigure(y:number,x:number) {
    if (y===6){
        return new CreateFigure(FiguresNameType.PAWN, FigureColorType.BLACK)
    }
    else if (y===1){
        return new CreateFigure(FiguresNameType.PAWN, FigureColorType.WHITE)
    }
    else if ((y===7 && x===0) || (y===7 && x===7) ){
        return new CreateFigure(FiguresNameType.ROOK, FigureColorType.BLACK)
    }
    else if ((x===0 && y===0) || (x===7 && y===0) ){
        return new CreateFigure(FiguresNameType.ROOK, FigureColorType.WHITE)
    }
    else if ((x===1 && y===0) || (x===6 && y===0) ){
        return  new CreateFigure(FiguresNameType.KNIGHT, FigureColorType.WHITE)
    }
    else if ((x===1 && y===7) || (x===6 && y===7)){
        return new CreateFigure(FiguresNameType.KNIGHT, FigureColorType.BLACK)
    }
    else if ((x===2 && y===0) || (x===5 && y===0) ){
        return  new CreateFigure(FiguresNameType.BISHOP, FigureColorType.WHITE)
    }
    else if ((x===2 && y===7) || (x===5 && y===7)){
        return new CreateFigure(FiguresNameType.BISHOP, FigureColorType.BLACK)
    }
    else if ((x===3 && y===0)){
        return  new CreateFigure(FiguresNameType.QUEEN, FigureColorType.WHITE)
    }
    else if ((x===3 && y===7)){
        return new CreateFigure(FiguresNameType.QUEEN, FigureColorType.BLACK)
    }
    else if ((x===4 && y===0)){
        return new CreateFigure(FiguresNameType.KING, FigureColorType.WHITE)
    }
    else if ((x===4 && y===7)){
        return new CreateFigure(FiguresNameType.KING, FigureColorType.BLACK)
    }
    else return null

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
    return board
}
class Cell implements CellType{
     cord:posFigureType
    figure:CreateFigure | null
    constructor(cord:posFigureType,figure:CreateFigure | null) {
        this.cord=cord
        this.figure=figure
    }
}
export default createBoard
