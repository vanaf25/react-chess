import {FigureColorType, FiguresNameType, FigureType, IconType} from "../types/types";

const importAll = (require:any) =>
    require.keys().reduce((acc:any, next:any) => {
        acc[next.replace("./", "")] = require(next);
        return acc;
    }, {});
//@ts-ignore
export const images=Object.fromEntries(Object.entries(importAll(require.context("./../assets", false, /\.(png|jpe?g|svg)$/))).map((el:any)=>[el[0],el[1].default]))
console.log(images)
export class CreateFigure implements FigureType{
    id:number
    name:FiguresNameType
    color:FigureColorType
    icon:IconType
    isFigureHasMoved?:boolean
    enPassant?:boolean
    constructor(name:FiguresNameType,color:FigureColorType) {
        this.id=Math.random()+Math.random()
        this.name=name
        this.color=color
        if (name===FiguresNameType.PAWN || name===FiguresNameType.ROOK || name===FiguresNameType.KING){
            this.isFigureHasMoved=false
        }
        if (name===FiguresNameType.PAWN) this.enPassant=false
        this.icon= images[`${color}_${name}.png`]
    }
}
