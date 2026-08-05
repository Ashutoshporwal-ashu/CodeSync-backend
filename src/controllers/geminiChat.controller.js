import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { GeminiChat } from "../models/geminiChat.model.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const askGemini = asyncHandler(async (req, res) => {
    // 🎯 FIX: 'promt' ko 'prompt' kiya
    const {roomId, prompt} = req.body
    const userId = req.user._id

    if(!prompt || !roomId){
        throw new ApiError(400, "Room Id and prompt are required")
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    let chatDoc = await GeminiChat.findOne({
        roomId: roomId,
        userId: userId
    })

    if(!chatDoc){
        chatDoc = await GeminiChat.create({
            roomId: roomId,
            userId: userId,
            history: []
        })
    }

    const formattedHistory = chatDoc.history.map(msg => (
        {
        role: msg.role,
        parts: msg.parts.map(p => ({text: p.text}))
        }
    ))

    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" })

    const chat = model.startChat({
        history: formattedHistory
    })

    try{
        const result = await chat.sendMessage(prompt)
        const aiResponseText = result.response.text()

        chatDoc.history.push(
            {
                role: "user",
                parts: [{text: prompt}]
            }
        )

        chatDoc.history.push(
            {
                role: "model",
                parts: [{text: aiResponseText}]
            }
        )

        await chatDoc.save()

        return res
        .status(200)
        .json(new ApiResponse(200, {answer: aiResponseText}, "Gemini replied successfully"))

    }catch(error){
        console.error("Gemini Api Error", error)
        throw new ApiError(500, "Failed to get response from Gemini AI")
    }
})

export {
    askGemini
}