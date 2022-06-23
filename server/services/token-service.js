import jwt from 'jsonwebtoken'
import tokenModel from './../models/token-model.js'
class TokenService {
    generateToken(payload){
   const accessToken=jwt.sign(payload,process.env.JWT_ACCESS_SECRET,{
       expiresIn:"30m"
   })
    const refreshToken=jwt.sign(payload,process.env.JWT_REFRESH_SECRET,{
        expiresIn:"30d"
    })
    return {accessToken,refreshToken}
    }
     validateAccessToken(token){
         console.log('tken',token);
        try {
            return jwt.verify(token,process.env.JWT_ACCESS_SECRET)
        }
        catch (e) {
        return null
        }
    }
      validateRefreshToken(token){
        try {
            return jwt.verify(token,process.env.JWT_REFRESH_SECRET)
        }
        catch (e) {
            return null
        }
    }
    async saveToken(userId,refreshToken){
    const tokenData=await tokenModel.findOne({user:userId})
        if (tokenData){
            tokenData.refreshToken=refreshToken
            return tokenData.save()
        }
        const token=await tokenModel.create({
            user:userId,
            refreshToken
        })
        return token
    }
async removeToken(refreshToken){
        const token=await tokenModel.deleteOne({refreshToken})
     return token ;
}
async findRefreshToken(refreshToken){
        const token=await tokenModel.findOne({refreshToken});
        return  token
}
}
export default new TokenService()
