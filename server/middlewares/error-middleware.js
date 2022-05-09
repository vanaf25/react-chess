import ApiErrors from "../exceptions/api-error.js";
export default function (err,req,res,next) {
    if (err instanceof ApiErrors){
        return res.status(err.status).json({status:err.status,message:err.message,errors:err.errors})
    }
    return res.status(500).json({message:"Unexpected error"})
}
