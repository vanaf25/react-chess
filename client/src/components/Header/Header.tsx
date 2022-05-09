import React from 'react';
import classes from "./Header.module.css";
import logo from './../../images/logo.webp'
import { Link } from 'react-router-dom';
import {useAppSelector} from "../../store/store";
import { useLogOutMutation } from '../../store/api/loginApi';
const Header = () => {
    const user=useAppSelector(state => state.auth.user)
    const isAuth=useAppSelector(state => state.auth.isAuth);
    const [logout]=useLogOutMutation()
    return (
        <div className={classes.header}>
            <div className={classes.header__container}>
             <Link to="/">
                 <div className={classes.header__logo}>
                     <div className={classes.header___image}>
                         <img src={logo} alt="logo"/>
                     </div>
                     <span className={classes.header__title}>React-chess</span>
                 </div>
             </Link>
                <div className={classes.header__menu}>
                    {isAuth ? <>
                        <Link className={ `${classes.menu__link} ${classes.menu__profile}`} to={"/profile"}>
                            {user?.name}
                        </Link>
                        <span style={{cursor:"pointer"}} onClick={()=>logout()} className={`${classes.menu__link} ${classes.menu__login}`}>
                            Logout
                        </span>
                    </>:
                        <Link  className={`${classes.menu__link} ${classes.menu__login}`} to={"/login"}>
                            Login
                        </Link>}
                </div>
            </div>

        </div>
    );
};

export default Header;
