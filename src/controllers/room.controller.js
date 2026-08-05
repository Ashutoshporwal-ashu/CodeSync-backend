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


const getPublicRoom = asyncHandler(async (req, res) => {
    
    const {roomId} = req.params

    if(!roomId){
        throw new ApiError(400, "Public room Id is required")
    }
    
    const PublicRoomDetails = await Room.findOne({
        roomId: roomId,
        roomType: "public"
    })

    if(!PublicRoomDetails){
        throw new ApiError(404, "Public room is not exist with this room id")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, PublicRoomDetails, "public room details fatched successfull"))
})

const getPrivateRoom = asyncHandler(async (req, res) => {
    
    const {roomId} = req.params

    if(!roomId){
        throw new ApiResponse(400, "Private room Id is required")
    }

    const PrivateRoomDetails = await Room.findOne({
        roomId: roomId,
        roomType: "private"
    }).populate("host", "fullname email")

    if(!PrivateRoomDetails){
        throw new ApiError(404, "Private Room is not exist with this room Id")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, PrivateRoomDetails, "Private Room Details fatched successfully"))
})

const savePublicRoomCode = asyncHandler(async (req, res) => {
    const {roomId} = req.params
    const {code, language} = req.body

    if(!roomId){
        throw new ApiError(400, "Public room Id is required for save this code")
    }

    const updatedPublicRoom = await Room.findOneAndUpdate(
        {
            roomId: roomId,
            roomType: "public"
        },
        {
            $set: {
                code: code,
                language: language
            }
        },
        {
            new: true
        }
    )

    if(!updatedPublicRoom){
        throw new ApiError(404, "Public room not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "code saved successfully"))
})

const savePrivateRoomCode = asyncHandler(async (req, res) => {
    const { roomId } = req.params
    const {code, language} = req.body
    const userId = req.user._id

    if(!roomId){
        throw new ApiError(400, "Private room id is required")
    }

    const updatedPrivateRoomCode = await Room.findOneAndUpdate(
        {
            roomId: roomId,
            roomType: "private"
        },
        {
            $set: {
                code: code,
                language: language
            }
        },
        {
            new: true
        }
    )

    if(!updatedPrivateRoomCode){
        throw new ApiError(404, "Private room is not found")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, {}, "Private Room updated successfully"))
})


export {
    CreatePrivateRoom,
    CreatePublicRoom,
    getPrivateRoom,
    getPublicRoom,
    savePrivateRoomCode,
    savePublicRoomCode
}