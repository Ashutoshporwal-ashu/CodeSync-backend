import { Router } from "express"
import { googelAuth, registerUser, verifyEmail } from "../controllers/user.controller.js"
import passport from "passport"

const router = Router()

router.route("/register").post(registerUser)
router.route("/verify-email").post(verifyEmail)

// google-auth routes
router.route("/google-auth").get(passport.authenticate("google", {scope: ["profile", "email"]}))
router.route("/google-auth-callback").get(passport.authenticate("google", { session: false }),
    googelAuth)

export default router