import {FigureType} from "../components/Board/Board";

export type posFigureType={
    x:number,
    y:number
}
 export type FigureColorType="white" | "black"

export type Board=Array<Cell>
export type Cell={
    cord:posFigureType,
    figure:FigureType | null
    available:boolean
}
