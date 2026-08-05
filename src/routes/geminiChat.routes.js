import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { askGemini } from "../controllers/geminiChat.controller.js";

const router = Router()

router.route("/ask").post(verifyJWT, askGemini)

export default router