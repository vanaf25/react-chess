import UserModel from './../models/user-model.js'
import bcrypt from 'bcrypt'
import {v4} from 'uuid'
import mailService from './mail-service.js'
class UserService {
async registration(name,email,password){
    const candidateEmail=await UserModel.findOne({email})
    if (candidateEmail){
        throw new Error("This email is use")
    }
    const candidateName=await UserModel.findOne({name})
    if (candidateName){
        throw new Error(`This name is use`)
    }
    const hashPassword=await bcrypt.hash(password,3);
    const activatedLink=v4()
    const user=await UserModel.create({email,name,password:hashPassword,activatedLink})
    await mailService.sendActivationMail(email,activatedLink)
}

}
export default new UserService()
