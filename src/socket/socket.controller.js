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

const initializeSocket = (io) => {
    
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

    // ==========================================
        // FUNCTIONALITY 5: LANGUAGE CHANGE SYNC
        // ==========================================
        socket.on("LANGUAGE_CHANGE", ({ roomId, language }) => {
            
            // socket.in() sender ko chhod kar room ke baaki sabko event bhej dega
            socket.in(roomId).emit("LANGUAGE_CHANGE", {
                language
            });
            
        });

        // ==========================================
        // FUNCTIONALITY 6: CUSTOM LEAVE ROOM BUTTON
        // ==========================================
        socket.on("LEAVE_ROOM", ({ roomId }) => {
            
            // Step 1: User ko sirf is specific room se bahar nikalo
            socket.leave(roomId);

            // Step 2: Room ke baaki logon ko notify karo ki yeh user leave kar gaya
            socket.in(roomId).emit("DISCONNECTED", {
                socketId: socket.id,
                username: userSocketMap[socket.id], 
            });

            // 🎯 SDE NOTE: Hum yahan `delete userSocketMap[socket.id]` NAHI kar rahe hain.
            // Kyunki user ne apna browser tab close nahi kiya hai, wo abhi bhi server par zinda hai!
        });
};

export {
    initializeSocket
}