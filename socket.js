// socket.js
let ioInstance;

function initSocketIO(server) {
  const { Server } = require("socket.io");
  ioInstance = new Server(server, {
    cors: {
      origin: "*", // adjust as needed
    },
  });

  // ✅ Setup listeners once, inside this file
  ioInstance.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    socket.on("join-user", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined their personal room`);
    });

    socket.on("join-store", (storeId) => {
      socket.join(storeId);
      console.log(`🏪 Admin joined store room ${storeId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔌 Client disconnected:", socket.id);
    });
  });

  return ioInstance;
}

function getIO() {
  if (!ioInstance) {
    throw new Error("❌ Socket.IO not initialized");
  }
  return ioInstance;
}

module.exports = {
  initSocketIO,
  getIO
};
