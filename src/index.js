import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

import http from "http"
import { Server } from  "socket.io"

dotenv.config({
    path: './env'
})

const httpServer = http.createServer(app)

const io = new Server(httpServer, {
    cors: {
        origin: process.env.CORS_ORIGIN || "http://localhost:5173",
        methods: ["GET", "POST"]
    }
})

io.on("connection", (Socket) => {
    console.log(`New User is connected: ${Socket.id}`)

    Socket.on(disconnect, () => {
        console.log(`User Disconnected: ${socket.id}`)
    })
})

connectDB()
.then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed!!!", err)
})