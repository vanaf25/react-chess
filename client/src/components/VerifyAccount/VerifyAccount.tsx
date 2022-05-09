import React from 'react';
import { useNavigate } from 'react-router-dom';
import {useAppSelector} from "../../store/store";

const VerifyAccount:React.FC = () => {
    const navigator=useNavigate()
    const user=useAppSelector(state => state.auth.user)
    const isAuth=useAppSelector(state => state.auth.isAuth)
    if (!isAuth) navigator("/login")
    if (user?.isActivated)  navigator("/")
    return (
        <div>
            <h1 style={{textAlign:"center"}}>We sending the mail to your e-mail for activation account</h1>
        </div>
    );
};

export default VerifyAccount;
