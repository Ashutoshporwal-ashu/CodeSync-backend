import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import "./utils/passport.js"

const app = express()

app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
        credentials: true
    })
)

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routes
import userRouter from "./routes/user.routes.js"
import roomRouter from "./routes/room.routes.js"
import geminiRouter from "./routes/geminiChat.routes.js"
import executionRouter from './routes/execution.routes.js'

app.use("/api/v1/users", userRouter)
app.use("/api/v1/rooms", roomRouter)
app.use("/api/v1/ai", geminiRouter)
app.use("/api/v1/execute", executionRouter)


export {app}