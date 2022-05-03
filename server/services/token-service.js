import jwt from 'jsonwebtoken'
import tokenModel from './../models/token-model.js'
class TokenService {
    generateToken(payload){
   const accessToken=jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
       expiresIn:"30m"
   })
    const refreshToken=jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
        expiresIn:"30d"
    })
    return {accessToken,refreshToken}

    }
    async saveToken(userId,refreshToken){
    const tokenData=await tokenModel.findOne({user:userId})
    }

}
export default new TokenService()
