import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    
    fullname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
    },

    authProvider: {
        type: String,
        enum: ['local', 'google', 'github'],
        default: 'local'
    },

    password: {
        type: String,
        required: function() {
            return this.authProvider === 'local'
        }
    },


    // email verification

    isVerified: {
        type: Boolean,
        default: false
    },

    verificationCode: {
        type: String,
    },

    verificationCodeExpiry: {
        type: Date
    },

    refreshToken: {
        type: String
    },

    // update password when forget
    
    forgotPasswordToken: {
        type: String
    },

    forgotPasswordExpiry: {
        type: Date
    }

}, {timestamps: true});

userSchema.pre("save", async function (next) {
    if(!this.password) return
    if(!this.isModified("password")){
        return
    }

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)