import mongoose, { Schema } from "mongoose";

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        unique: true,
        required: true,
        index: true
    },

    roomType: {
        type: String,
        enum: ["public", "private"],
        default: "public"
    },

    host: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    code: {
        type: String,
        default: "// Write your code here...",
    },

    language: {
        type: String,
        default: "javaScript"
    }

}, {timestamps: true})

export const Room = mongoose.model("Room", roomSchema)