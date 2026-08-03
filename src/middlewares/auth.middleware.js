import jwt, { verify } from "jsonwebtoken"
import { ApiResponse } from "../utils/ApiResponse.js"
import {ApiError} from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken
    
        if(!token){
            throw new ApiError(401, "Unauthorized request. No token found.")
        }
    
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodeToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid access token or User no longer exists")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
})