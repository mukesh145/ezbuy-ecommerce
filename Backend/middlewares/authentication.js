import ErrorHandler from "../utils/errorHandler.js"
import jwt from "jsonwebtoken"
import User from "../models/userSchema.js"

//To authenticate user
export const authenticateUser = async (req, res, next)=>{
    const {token} = req.cookies

    if(!token){
        return next(new ErrorHandler("Login first to access this resource",401))
    }

    const decoded = jwt.decode(token, process.env.SECRETE_KEY)
    req.user = await User.findById(decoded.id)

    next()
}


//To authorize user
export const  isAuthorizedUser = (...roles)=>{
    return (req, res, next)=>{

        if(!roles.includes(req.user.type)){
            return next(new ErrorHandler(`role ${req.user.type} can not access this resource`,403))
        }

        next()
    }
}