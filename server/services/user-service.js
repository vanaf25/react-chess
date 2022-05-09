import UserModel from './../models/user-model.js'
import bcrypt from 'bcrypt'
import {v4} from 'uuid'
import MailService from './mail-service.js'
import tokenService from './token-service.js'
import UserDto from './../dtos/user-dto.js'
import ApiErrors from "../exceptions/api-error.js";
class UserService {
async registration(name,email,password){
    const candidateEmail=await UserModel.findOne({email})
    if (candidateEmail){
       throw  ApiErrors.BadRequest("This email already use ")
    }
    const candidateName=await UserModel.findOne({name})
    if (candidateName){
        throw  ApiErrors.BadRequest("This name already use ")
    }
    const hashPassword=await bcrypt.hash(password,3);
    const activatedLink=v4()
    const user=await UserModel.create({email,name,password:hashPassword,activatedLink})
 /*   const mailService=new MailService()*/
/*
    await mailService.sendActivationMail(email,name,`${process.env.API_URL}/api/activate/${activatedLink}`);
*/
    const userDto=new UserDto(user)
    console.log(userDto)
    const tokens=tokenService.generateToken({...userDto});
    await tokenService.saveToken(userDto.id,tokens.refreshToken)
    return {
        ...tokens,
        user:userDto
    }
}
async getUsers(){
    return  await UserModel.find({})
}
async activation(activationLink){
    const user=await UserModel.findOne({activationLink});
    if (!user){
        throw new Error("Link is not defined")
    }
    user.isActivated=true
    await user.save();
}
async login(name,password){
    const user=await UserModel.findOne({$or:[{name},{email:name}]});
    if (!user) throw ApiErrors.BadRequest("Password or name isn't correct");
    const isPassEqual=await bcrypt.compare(password,user.password);
    if (!isPassEqual) throw ApiErrors.BadRequest("Password or name isn't correct");
    const userDto=new UserDto(user);
    const tokens=tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id,tokens.refreshToken)
    return {
        ...tokens,
        user:userDto
    }
}
async logout(refreshToken){
 await tokenService.removeToken(refreshToken)
}
async refresh(refreshToken){
    if (!refreshToken){
        throw ApiErrors.UnauthorizedError()
    }
    const userData=tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb=await tokenService.findRefreshToken(refreshToken)
    if (!userData || !tokenFromDb){
        throw ApiErrors.UnauthorizedError()
    }
    const user=await UserModel.findById(userData.id);
    const userDto=new UserDto(user);
    console.log(user)
    const tokens=tokenService.generateToken({...userDto})
    await tokenService.saveToken(userDto.id,tokens.refreshToken)
    return {
        ...tokens,
        user:userDto
    }
}
}
export default new UserService()
