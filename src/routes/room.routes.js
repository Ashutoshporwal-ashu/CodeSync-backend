import { rootCertificates } from "tls";
import { CreatePrivateRoom, CreatePublicRoom, getPrivateRoom, getPublicRoom, savePrivateRoomCode, savePublicRoomCode } from "../controllers/room.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router()

router.route("/create-private-room").post(verifyJWT, CreatePrivateRoom)
router.route("/create-public-room").post(CreatePublicRoom)

// get details of room
router.route("/private/:roomId")
    .get(verifyJWT, getPrivateRoom)
    .put(verifyJWT, savePrivateRoomCode) // save code in private room

router.route("/public/:roomId")
    .get(getPublicRoom)
    .put(savePublicRoomCode) // save code in public room

export default router