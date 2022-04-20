import {Board, Cell, Checks, FigureColorType, FiguresNameType, FigureType, posFigureType} from "../types/types";
import {checkCordIsEqual, checkFiguresForColor, getCellByCoords} from "../store/utils";
import {checkIsMoveCorrect} from "./globalRules";

const isCheck=(board:Board,checks:Checks)=>{
    checks={
        "white":false,
        "black":false
    }
    board.forEach(cell=>{
        if (cell.figure?.name===FiguresNameType.KING){
            board.forEach((cell1)=>{
                if (!checkCordIsEqual(cell1.cord,cell.cord) && checkFiguresForColor(cell1.figure,cell.figure) ) {
                    if(checkIsMoveCorrect(cell1,cell,board,checks)){
                        if (cell.figure){
                           checks[cell.figure.color]=true
                        }
                    }
                }
            })
        }
    })
    return checks
}
export const checkCellsForAvailableForOpponent=(startCell:Cell,endCell:Cell,board:Board)=>{
    let isAvailable;
    let startX=startCell.cord.x
    let endX=endCell.cord.x
    if (startX>endX)  startX--
    else if (endX>startX) startX++
    while (startX!==endX){
        const currentCell=getCellByCoords(board,startX,startCell.cord.y)
        board.forEach(cell=>{
            if (cell.figure  && checkFiguresForColor(startCell.figure,cell.figure)){
                if (checkIsMoveCorrect(cell,currentCell,board)){
                    isAvailable=true
                }
            }
        })
        if (startX>endX){
            startX--
        }
        else if (endX>startX){
            startX++
        }
    }
    return isAvailable
}
export const isMate=(board:Board,currentMove:FigureColorType,checks:Checks)=>{
    let isTrue=true
            board.forEach(movedCell=>{
                if (movedCell.figure && movedCell.figure?.color===currentMove){
                    board.forEach(el=>{
                        if(isTrue){
                            const type:any=checkIsMoveCorrect(movedCell,el,board)
                            if (type){
                                let isMoveCorrect=false
                                let imitationBoard:Board=JSON.parse(JSON.stringify(board))
                                //@ts-ignore
                                imitationBoard=imitationBoard.map((cell)=>{
                                    if (checkCordIsEqual(cell.cord,el.cord)){
                                        if (type){
                                            isMoveCorrect=true
                                            if (type?.type==="castling"){
                                                const figure=type?.startCell?.figure
                                                imitationBoard.forEach(cell=>{
                                                    if (checkCordIsEqual(cell.cord,type?.endCord as posFigureType )){
                                                        cell.figure=figure as FigureType
                                                    }
                                                    else if (checkCordIsEqual(cell.cord,type?.startCell?.cord as posFigureType)){
                                                        cell.figure=null
                                                    }
                                                })
                                            }
                                            else if (type?.action==="passant"){
                                                imitationBoard.forEach(cell=>{
                                                    if (checkCordIsEqual(cell.cord,type?.cords as posFigureType )){
                                                        cell.figure=null
                                                    }
                                                })
                                            }
                                            else if (type?.action==="setEnPassant"){
                                                imitationBoard.forEach(cell=>{
                                                    if (checkCordIsEqual(cell.cord,type?.cords as posFigureType)){
                                                        if (cell.figure){
                                                            cell.figure.enPassant=true
                                                        }

                                                    }
                                                })
                                            }
                                            //clear the moved cell
                                            imitationBoard.forEach(cell=>{
                                                if (checkCordIsEqual(cell.cord,movedCell.cord)){
                                                    cell.figure=null
                                                }
                                                if (cell.figure!==null && !checkCordIsEqual(cell.cord,type?.cords as posFigureType)){
                                                    cell.figure.enPassant=false
                                                }
                                            })
                                            return {...cell,figure:{...movedCell.figure,isFigureHasMoved:true}}
                                        }
                                    }
                                    return cell
                                });
                                if (isMoveCorrect){
                                    if (!isCheck(imitationBoard,checks)[currentMove]){
                                        isTrue=false
                                    }
                                }
                            }
                        }

                    })
                }

            })
    return isTrue
}
export default isCheck
