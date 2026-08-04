import { CreatePrivateRoom, CreatePublicRoom } from "../controllers/room.controller";
import { verifyJWT } from "../middlewares/auth.middleware";
import { Router } from "express";

const router = Router()

router.route("/create-private-room").post(verifyJWT, CreatePrivateRoom)
router.route("/create-public-room").post(CreatePublicRoom)

export default router