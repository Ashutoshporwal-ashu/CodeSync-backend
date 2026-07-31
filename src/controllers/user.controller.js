import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { sendWelcomeEmail } from "../utils/sendWelcomeEmail.js";
import { use } from "react";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
    
        const refreshToken = user.generateRefreshToken()
        const accessToken = user.generateAccessToken()
    
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})

        return {accessToken, refreshToken}
    } catch (error) {
        console.log("error while generation refresh and accessToken", error)
        throw new ApiError(500, "something went wrong while generation refresh and accessToken")
    }
}

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

    // const createdUser = await User.findById(user._id).select("-password -verificationCode -verificationCodeExpiry")

    return res
    .status(201)
    .json(new ApiResponse(201, {email: user.email}, "Account created successfully. A verification OTP has been sent to your email."));
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

    const name = user.fullname

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

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)
    
    const options = {
        httpOnly: true,
        secure: true
    }

    const createdUser = await User.findById(user._id).select("-password -verificationCodeExpiry -verificationCode")

    sendWelcomeEmail(email, name)

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, createdUser, "Email verified successfully. Your account is now active."));
})

const googelAuth = asyncHandler(async (req, res) => {
    const profile = req.user // email, avatar, name

    if(!profile){
        throw new ApiError(500, "User profile could not be found")
    }
    
    const name = profile.displayName
    const email = profile.emails[0].value

    let user = await User.findOne({email})

    if(!user){
        user = await User.create({
            fullname: name,
            email: email,
            isVerified: true,
            authProvider: 'google'
        })

        if(!user){
            throw new ApiError(500, "Google authentication failed while creating user")
        }

        sendWelcomeEmail(email, name)
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const createdUser = await User.findById(user._id).select("-password -verificationCode -verificationCodeExpiry")

    return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(new ApiResponse(200, createdUser, "Google Authantification Successful"))

})


const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        throw new ApiError(400, "Email and password are required.");
    }

    const user = await User.findOne({email})

    if(!user){
        throw new ApiError(401, "Invalid email or password.");
    }

    if(user.authProvider !== 'local'){
        throw new ApiError(400, `You registered using ${user.authProvider}. Please continue with Google.`)
    }

    if (!user.isVerified) {
        throw new ApiError(403, "Your account is not verified. Please verify your email first.");
    }

    const isValidPassword = user.isPasswordCorrect(password)

    if(!isValidPassword){
        throw new ApiError(401, "Invalid email or password.")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }
    
    const loggedInUser = await User.findById(user._id).select("-password -verificationCode -verificationCodeExpiry")

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, loggedInUser, "User logged in successfully."))

})

export {
    registerUser,
    verifyEmail,
    googelAuth,
    login
}