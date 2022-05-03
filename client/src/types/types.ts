export type posFigureType={
    x:number,
    y:number
}
export enum FigureColorType {
    WHITE="white",
    BLACK="black"
}
export  enum FiguresNameType{
    PAWN="pawn",
    ROOK="rook",
    KNIGHT="knight",
    BISHOP="bishop",
    QUEEN="queen",
    KING="king"
}
export type FigureType={
    id:number,
    name:FiguresNameType,
    color:FigureColorType,
    isFigureHasMoved?:boolean
    icon:any,
    enPassant?:boolean
}
export type Board=Array<Cell>
export type Cell={
    cord:posFigureType,
    figure:FigureType | null
    color:FigureColorType
}
export interface IconType{
    default:string
}
 export interface Checks {
    "white":boolean,
    "black":boolean
}
export type Mate=FigureColorType | "stalemate" | "draw" | `white lost by the time` | "black lost by the time"
