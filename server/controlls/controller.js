import userService from './../services/user-service.js'
import {validationResult} from "express-validator";
import ApiErrors from "../exceptions/api-error.js";
class UserController {
    async registration(req,res,next){
        try {
            const errors=validationResult(req)
            if (!errors.isEmpty()){
                return next(ApiErrors.BadRequest("Bad request",errors.array()))
            }
          const {name,email,password}=req.body;
          const user=await userService.registration(name,email,password);
            res.cookie('refreshToken', user.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000})
          return res.json(user)
        }
        catch (e) {
            next(e)
        }
    }
    async login(req,res,next){
        try {
            const {name,password}=req.body
            const userData=await userService.login(name,password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000})
            return res.json(userData)
        }
        catch (e) {
            next(e)
        }
    }
    async logout(req,res,next){
        try {
            const {refreshToken}=req.cookies;
            await userService.logout(refreshToken)
            res.clearCookie("refreshToken")
            return res.json( {message:"Logout"})
        }
        catch (e) {
            next(e)
        }
    }
    async refresh(req,res,next){
        try {
          const {refreshToken}=req.cookies;
            console.log(refreshToken)
            const userData=await userService.refresh(refreshToken)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000})
            return res.json(userData)
        }
        catch (e) {
            next(e)
        }
    }
    async activate(req,res,next){
        try {
           const activationLink=req.params.link
            await userService.activation(activationLink)
            return res.redirect(process.env.CLIENT_URL)
        }
        catch (e) {
            next(e)
        }
    }
    async getUsers(req,res,next){
        try {
       const users=await userService.getUsers()
            res.json(users)
        }
        catch (e) {
            next(e)
        }
    }
}
export default new UserController()
