import {Board, Cell, posFigureType} from "../types/types";
import {FigureType} from "../components/Board/Board";
import {log} from "util";
export const getCellByCoords=(board:Board,x:number,y:number)=>board.filter(cell=>cell.cord.x===x && cell.cord.y===y)
export const checkCordIsEqual=(firstCord:posFigureType,secondCord:posFigureType)=>firstCord?.y===secondCord?.y
    && firstCord?.x===secondCord?.x
