import React from 'react';
import {Board} from "../components/Board/Board";
import Side from "../components/Side/Side";

const Game = () => {
    return (
        <div style={{display:"flex",justifyContent:"center"}}>
            <Board/>
            <Side/>
        </div>
    );
};

export default Game;
