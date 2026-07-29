import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

const registerUser = asyncHandler(async (req, res) => {
    const {fullname, email, password} = req.body

    if(!fullname || !email || !password){
        throw new ApiError(400, "All fields are required.")
    }

    const existedUser = await User.findOne({email})
    
    if(existedUser){
        throw new ApiError(409, "User with this email already exists")
    }
    
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digit random code
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min time to expire
    const user = await User.create({
        fullname: fullname,
        email: email,
        password: password,
        isVerified : false,
        verificationCode: verificationCode,
        verificationCodeExpiry: verificationCodeExpiry
    })

    if(!user){
        throw new ApiError(500, "Something went wrong while creating the user account.")
    }

    await sendVerificationEmail(email, verificationCode);

    const createdUser = await User.findById(user._id).select("-password -verificationCode -verificationCodeExpiry")

    return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "Account created successfully. A verification OTP has been sent to your email."));
})

const verifyEmail = asyncHandler(async (req, res) => {
    const { OTP, email } = req.body

    if(!OTP){
        throw new ApiError(400, "Verification code is required.")
    }

    if(!email){
        throw new ApiError(400, "Email address is required.")
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(404, "User not found with the provided email.")
    }

    if(user.isVerified){
        throw new ApiError(409, "User account is already verified.")
    }

    if(user.verificationCode != OTP){
        throw new ApiError(400, "Invalid verification code.")
    }

    if(user.verificationCodeExpiry < Date.now()){
        throw new ApiError(400, "The verification code has expired. Please request a new one.")
    }

    user.verificationCode = undefined
    user.verificationCodeExpiry = undefined
    user.isVerified = true

    await user.save({validateBeforeSave: false})

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully. Your account is now active."));
})

export {
    registerUser,
    verifyEmail
}