import React from 'react';
import logo from './../../images/logo.webp'
import classes from "./FullyPreloader.module.css";
const FullyPreloader = () => {
    return (
        <div className={classes.preloader}>
            <div className={classes.preloader__content}>
                <img src={logo} className={classes.preloader__image} alt="logo"/>
            </div>
        </div>
    );
};

export default FullyPreloader;
