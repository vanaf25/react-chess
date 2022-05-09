import {
    Box,
    Button, Link as StyledLink,
    TextField,
} from '@mui/material';
import React, {useState} from 'react';
import classes from './../Registration/Registration.module.css'
import {Controller, useForm} from "react-hook-form";
import { useLoginMutation } from '../../store/api/loginApi';
import {useAppSelector} from "../../store/store";
import {Link, useNavigate} from 'react-router-dom'
type formData={
    name:string,
    password:string,
}
 type FieldType={
    id:number,
    name:InputTypes,
    rules:any,
    typeOfField:string
}
type InputTypes="name" | "password"
const Login:React.FC = () => {
    const isAuth=useAppSelector(state => state.auth.isAuth);
    const navigate=useNavigate();
    if (isAuth) navigate("/");
    const {handleSubmit,formState:{errors},control,reset} = useForm<formData>();
    const [loginError,setLoginError]=useState("");
    const [login,{isLoading}]=useLoginMutation()
    const onSubmit = async (data:formData) =>{
        reset({
            name:"",
            password:"",
        })
       const response:any=await login({name:data.name,password:data.password} as unknown as Omit<FormData, "repeatPassword" | "email">)
        if (response?.error?.data?.message){
            setLoginError(response?.error?.data?.message);
        }
        else {

            setLoginError("")
        }
    };
    const fields:Array<FieldType>=[
        {
            id:1,
            name:"name" as InputTypes,
            rules:{
                required:"Enter the name",
            },
            typeOfField:"text"
        },
        {
            id:2,
            name:"password" as InputTypes,
            rules:{
                required:"Enter the password",
            },
            typeOfField:"password"
        },
    ]
    return (
        <div className={classes.formBox}>
            <h2 className={classes.form__title}>Login</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                {fields.map(textField=><Controller key={textField.id}
                                                   name={textField.name}
                                                   control={control}
                                                   rules={textField.rules}
                                                   render={
                                                       ({ field }) =><TextField
                                                       type={textField.typeOfField}
                                                       helperText={errors[textField.name]?.message}
                                                       error={textField.name in errors || !!loginError }
                                                       margin={"normal"}  fullWidth
                                                       label={textField.name}  {...field} />}
                />)}
                {loginError && <p style={{color:"red"}}>{loginError}</p>}
               <Link to={"/registration"}>
                   <Box sx={{ color: 'primary.main',marginBottom:"10px" }}>Don't Have an account? Registration!</Box>
               </Link>
                <Button disabled={isLoading} type={"submit"}  variant="contained">Login</Button>
            </form>
        </div>
    );
};
export default Login
