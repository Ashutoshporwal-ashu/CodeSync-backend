import { Room } from "../models/room.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import crypto from "crypto"

const CreatePrivateRoom = asyncHandler(async (req, res) => {
    const userId = req.user._id

    const roomId = `PRI-${crypto.randomBytes(6).toString("hex")}`

    const PrivateRoom = await Room.create({
        roomId: roomId,
        roomType: "private",
        host: userId
    })

    if(!PrivateRoom){
        throw new ApiError(500, "Private room could not created")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, PrivateRoom, "Private Room created successfully"))
})

const CreatePublicRoom = asyncHandler(async (req, res) => {
    const roomId = `PUB-${crypto.randomBytes(6).toString("hex")}`

    const PublicRoom = await Room.create({
        roomId: roomId,
        roomType: "public",
    })

    if(!PublicRoom){
        throw new ApiError(500, "Public room is not created")
    }

    return res
    .status(201)
    .json(new ApiResponse(201, PublicRoom, "Public room is created"))
})

export {
    CreatePrivateRoom,
    CreatePublicRoom
}