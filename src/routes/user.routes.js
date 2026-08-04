import { Router } from "express"
import { forgetPassword, googelAuth, login, logout, registerUser, resetPassword, verifyEmail } from "../controllers/user.controller.js"
import passport from "passport"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(registerUser)
router.route("/verify-email").post(verifyEmail)

// google-auth routes
router.route("/google-auth").get(passport.authenticate("google", {scope: ["profile", "email"]}))
router.route("/google-auth-callback").get(passport.authenticate("google", { session: false }),
    googelAuth)

router.route("/login").post(login)

// password reset
router.route("/forget-password").post(forgetPassword)
router.route("/reset-password/:token").patch(resetPassword)

//logout
router.route("/logout").post(verifyJWT, logout);

export default router