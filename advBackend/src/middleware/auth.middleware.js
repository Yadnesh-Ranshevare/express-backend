import  jwt  from "jsonwebtoken";
import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
    //you can have access to access token in cookie or in request header( in header syntax is Authorization:Bearer <token> so we use replace method to remove the starting part of the auth header)
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")  
        if(!token){
            throw new apiError(401,"unauthorized request")
        }
    
        const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRETE)  //this will give you the original info on wic the token is form
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new apiError(401,"invalid access token")
        }
    
        req.user=user       //inserting our user into the request body to access it through request
        next()
    } catch (error) {
        throw new apiError(401,error.message||"invalid access token")   
    }
}) 