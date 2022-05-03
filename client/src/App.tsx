import React from 'react';
import './App.css';
import {Board} from "./components/Board/Board";
import Side from "./components/Side/Side";
function App() {
  return (
      <div style={{display:"flex",justifyContent:"center"}}>
        <Board/>
        <Side/>
      </div>

  );
}

export default App;
