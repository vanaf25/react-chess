import ApiErrors from "../../exceptions/api-error.js";
import tokenService from "../../services/token-service.js";
export default function (socket,next) {
    try {
        const authorizationHeader=socket.handshake.auth.authorization;
        console.log(authorizationHeader);
        if (!authorizationHeader) return next(ApiErrors.UnauthorizedError())
        const authToken=authorizationHeader.split(" ")[1];
        if (!authToken){
            return next(ApiErrors.UnauthorizedError())
        }
        console.log(authToken)
        const userData=tokenService.validateAccessToken(authToken)
        console.log(userData)
        if (!userData) return next(ApiErrors.UnauthorizedError());
        next()
    }
   catch (e) {
       console.log('error')
       return next(ApiErrors.UnauthorizedError())
   }
}
