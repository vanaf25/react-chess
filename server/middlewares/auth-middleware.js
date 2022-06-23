import ApiErrors from "../exceptions/api-error.js";
import tokenService from './../services/token-service.js'
export default function (req,res,next) {
try {
const authorizationHeader=req.headers.authorization;
    console.log(req.headers)
    console.log(authorizationHeader)
    if (!authorizationHeader) return next(ApiErrors.UnauthorizedError())
    const accessToken=authorizationHeader.split(" ")[1]
    console.log('accessToken',accessToken)
    if (!accessToken) return next(ApiErrors.UnauthorizedError());
    console.log('accessToken',accessToken)
    const userData=tokenService.validateAccessToken(accessToken)
    if (!userData) return next(ApiErrors.UnauthorizedError());
    req.user=userData
    next()
}
catch (e) {
   return  next(ApiErrors.UnauthorizedError())
}
}
