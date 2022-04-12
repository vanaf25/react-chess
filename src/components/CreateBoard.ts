import {CreateFigure} from "./CreateFigure";
import {Board, Cell as CellType, posFigureType} from "../types/types";
import {FigureType} from "./Board/Board";
const colors:{black:"black",white:"white"}={
    black:"black",
    white:"white"
}
function returnNameOfFigure(y:number,x:number) {
    if (y===6){
        return new CreateFigure("pawn",colors.black)
    }
    else if (y===1){
        return new CreateFigure("pawn",colors.white)
    }
    else if ((y===7 && x===0) || (y===7 && x===7) ){
        return new CreateFigure("rook",colors.black)
    }
    else if ((x===0 && y===0) || (x===7 && y===0) ){
        return new CreateFigure("rook",colors.white)
    }
    else if ((x===1 && y===0) || (x===6 && y===0) ){
        return  new CreateFigure("knight",colors.white)
    }
    else if ((x===1 && y===7) || (x===6 && y===7)){
        return new CreateFigure("knight",colors.black)
    }
    else if ((x===2 && y===0) || (x===5 && y===0) ){
        return  new CreateFigure("bishop",colors.white)
    }
    else if ((x===2 && y===7) || (x===5 && y===7)){
        return new CreateFigure("bishop",colors.black)
    }
    else if ((x===3 && y===0)){
        return  new CreateFigure("queen",colors.white)
    }
    else if ((x===3 && y===7)){
        return new CreateFigure("queen",colors.black)
    }
    else if ((x===4 && y===0)){
        return new CreateFigure("king",colors.white)
    }
    else if ((x===4 && y===7)){
        return new CreateFigure("king",colors.black)
    }
    else {
        return null
    }
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
    readonly cord:posFigureType
    figure:CreateFigure | null
    available:boolean
    constructor(cord:posFigureType,figure:CreateFigure | null) {
        this.cord=cord
        this.figure=figure
        this.available=false
    }
}
export default createBoard
