import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import {Link, useNavigate} from "react-router-dom";
import React, {useState} from 'react';
import classes from './Registration.module.css'
import {Controller, useForm} from "react-hook-form";
import { useRegistrationMutation } from '../../store/api/loginApi';
import {useAppDispatch, useAppSelector} from "../../store/store";
import { setUserData } from '../../store/reducers/authReducer';
export type formData={
   name:string,
   email:string,
   password:string,
   repeatPassword:string
}
export type FieldType={
    id:number,
    name:InputTypes,
    rules:any,
    typeOfField:string
}
type InputTypes="name" | "email" | "repeatPassword" | "password"
const Registration = () => {
    const isAuth=useAppSelector(state => state.auth.isAuth);
    const navigate=useNavigate();
    if (isAuth) navigate("/")
    const {handleSubmit,formState:{errors},control,getValues,reset} = useForm<formData>();
    const registrationError=useAppSelector(state => state.auth.error)
    const [registration,{isLoading}]=useRegistrationMutation()
    const dispatch=useAppDispatch()
    const onSubmit = async (data:formData) =>{
          const user:any=await registration({email: data.email, name: data.name, password: data.password} as unknown as Omit<FormData,"repeatPassword">).unwrap();
        if (!registrationError) reset({
            name:"",
            email:"",
            password:"",
            repeatPassword:""
        })

        dispatch(setUserData(user))
       return  navigate("/verifyAccount")
    };
    const fields:Array<FieldType>=[
        {
            id:1,
            name:"name" as InputTypes,
            rules:{
                required:"Name is required",
                minLength: {
                    value: 3,
                    message: "Min length is 3"
                }
            },
            typeOfField:"text"
        },
        {
            id:2,
            name:"email" as  InputTypes,
            rules:{
                required:"Email is required",
               pattern:{
                   value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                   message: "invalid email address"
               }
            },
            typeOfField:"text"
        },
        {
            id:3,
            name:"password" as InputTypes,
            rules:{
                required:"Password is required",
                pattern: {
                    value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: "Password must contain Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"
                }
            },
            typeOfField:"password"
        },
        {
            id:4,
            name:"repeatPassword" as InputTypes,
            rules:{
                required:"Repeat the password",
                validate:(value:string)=>value===getValues("password") ? true :"Repeat the password"
            },
            typeOfField:"password"
        }
    ]
    return (
        <div className={classes.formBox}>
            <h2 className={classes.form__title}>Registration</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map(textField=><Controller key={textField.id}
                    name={textField.name}
                    control={control}
                    rules={textField.rules}
                    render={({ field }) =><TextField type={textField.typeOfField} helperText={errors[textField.name]?.message} error={textField.name in errors }  margin={"normal"}  fullWidth   label={textField.name}  {...field} />}
                />)}
                <Link to={"/login"}>
                    <Box sx={{ color: 'primary.main',marginBottom:"10px" }}>Have an account? Login!</Box>
                </Link>
                {registrationError && <Box sx={{padding:"5px 15px", marginBottom:"10px",backgroundColor: 'error.main',color:"#fff",
                    textAlign:"center" }}>{registrationError}</Box>}
                <Button disabled={isLoading} type={"submit"}  variant="contained">Registration</Button>
            </form>
        </div>
    );
};

export default Registration;
