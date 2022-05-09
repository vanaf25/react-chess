import React from 'react';
import './App.css';
import Header from "./components/Header/Header";
import {Route, Routes } from 'react-router-dom';
import Login from "./components/Login/Login";
import Registration from "./components/Registration/Registration";
import VerifyAccount from './components/VerifyAccount/VerifyAccount';
import { useIsAuthQuery } from './store/api/loginApi';
import Game from "./Game/Game";
import Main from "./components/Main/Main";
function App() {
    const {data,isLoading}=useIsAuthQuery(5,{
        skip:!localStorage.getItem("accessToken")
    })
    if (!isLoading) console.log(data);
  return (
      <>
          <Header/>
          <Routes>
              <Route path={"/"} element={<Main/>}/>
            <Route path={"/game"} element={<Game/>}/>
            <Route path={"/login"} element={<Login/>}/>
            <Route path={"/registration"} element={<Registration/>}/>
            <Route path={"/verifyAccount"} element={<VerifyAccount/>}/>
          </Routes>

      </>


  );
}

export default App;
