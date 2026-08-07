import dotenv from "dotenv"
import connectDB from "./db/index.js";
import { app } from "./app.js";

import http from "http"
import { Server } from  "socket.io"
import {initializeSocket} from "./socket/socket.controller.js"

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

initializeSocket(io);

connectDB()
.then(() => {
    httpServer.listen(process.env.PORT || 8000, () => {
        console.log(`server is running at port: ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MONGO DB connection failed!!!", err)
})