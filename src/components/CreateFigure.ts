import {
    faChessBishop,
    faChessKing,
    faChessKnight,
    faChessPawn,
    faChessQueen,
    faChessRook
} from "@fortawesome/free-solid-svg-icons";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {FiguresNameType, FigureType} from "./Board/Board";
import {FigureColorType} from "../types/types";
export class CreateFigure implements FigureType{
    id:number
    name:FiguresNameType
    color:FigureColorType
    icon:IconDefinition | undefined | null
    isFigureHasMoved?:boolean
    constructor(name:FiguresNameType,color:FigureColorType) {
        this.id=Math.random()+Math.random()
        this.name=name
        this.color=color
        if (name==="pawn" || name==="rook" || name==="king"){
            this.isFigureHasMoved=false
        }
        this.icon= name ? switchIcon(name):null
    }
}
export const switchIcon=(name:string)=>{
    switch (name) {
        case "pawn":
            return  faChessPawn;
        case "bishop":
            return  faChessBishop;
        case "rook":
           return  faChessRook;
        case "queen":
            return  faChessQueen;
        case "king":
            return  faChessKing;
        case "knight":
           return  faChessKnight;
    }
}
