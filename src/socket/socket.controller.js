import { Socket } from "socket.io";
const userSocketMap = {};

function getAllConnectedClients (io, roomId){
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId], // Map se naam nikal liya
            };
        }
    );
}

initializeSocket = (io) => {
    
    // Main Gate: Jab koi bhi naya user website par aayega
    io.on("connection", (socket) => {
        console.log(`🟢 Connection Ban Gaya: ${socket.id}`);

        // ==========================================
        // FUNCTIONALITY 1: USER KI ENTRY
        // ==========================================
        socket.on("JOIN_ROOM", ({ roomId, username }) => {
            userSocketMap[socket.id] = username

            socket.join(roomId);
            const clients = getAllConnectedClients(io, roomId)
            io.to(roomId).emit(
                "JOINED",
                {
                    clients,
                    username,
                    socketId: socket.id
                }
            )
        });


        // ==========================================
        // FUNCTIONALITY 2: LIVE CODE TYPING
        // ==========================================
        socket.on("CODE_CHANGE", ({ roomId, code }) => {
            socket.in(roomId).emit("CODE_CHANGE", {
                code
            })
        });


        // ==========================================
        // FUNCTIONALITY 3: NAYE USER KO PURANA CODE DENA
        // ==========================================
        socket.on("SYNC_CODE", ({ socketId, code }) => {
            io.to(socketId).emit("CODE_CHANGE", {
                code
            })
        });


        // ==========================================
        // FUNCTIONALITY 4: USER KI EXIT (TAB CLOSE)
        // ==========================================
        socket.on("disconnecting", () => {
            const rooms = [...socket.rooms];

            rooms.forEach((roomId) => {
                socket.in(roomId).emit("DISCONNECTED", {
                    socketId: socket.id,
                    username: userSocketMap[socket.id],
                })
            })

            delete userSocketMap[socket.id]

            console.log(`🔴 User Disconnected: ${socket.id}`);
        });

    });
};

export {
    initializeSocket
}