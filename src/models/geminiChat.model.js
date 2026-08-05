import mongoose, { Schema } from "mongoose";

const geminiChatSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        index: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    history: [
        {
            role: {
                type: String,
                enum: ["user", "model"],
                required: true
            },

            parts: [
                {
                    text: {
                        type: String,
                        required: true
                    }
                }
            ],
            _id: false
        }
    ],
}, {timestamps: true})

export const GeminiChat = mongoose.model("GeminiChat", geminiChatSchema)