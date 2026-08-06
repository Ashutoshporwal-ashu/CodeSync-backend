import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { executeCode } from "../controllers/execution.controller";

const router = Router()

router.route("/run").post(executeCode)

export default router