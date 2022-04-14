import {FiguresNameType, FigureType} from "./Board/Board";
import {FigureColorType, IconType} from "../types/types";
const importAll = (require:any) =>
    require.keys().reduce((acc:any, next:any) => {
        acc[next.replace("./", "")] = require(next);
        return acc;
    }, {});
//@ts-ignore
const images:any = importAll(require.context("./../assets", false, /\.(png|jpe?g|svg)$/));
export class CreateFigure implements FigureType{
    id:number
    name:FiguresNameType
    color:FigureColorType
    icon:IconType
    isFigureHasMoved?:boolean
    constructor(name:FiguresNameType,color:FigureColorType) {
        this.id=Math.random()+Math.random()
        this.name=name
        this.color=color
        if (name==="pawn" || name==="rook" || name==="king"){
            this.isFigureHasMoved=false
        }
        this.icon= images[`${color}_${name}.png`]
    }
}
