import React from 'react';
import {Board} from "../components/Board/Board";
import Side from "../components/Side/Side";
import Chat from "../components/Chat/Chat";

const Game = () => {
    return (
        <div style={{display:"flex",justifyContent:"center",flexWrap:"wrap"}}>
            <Chat/>
            <Board/>
            <Side/>
        </div>
    );
};

export default Game;
