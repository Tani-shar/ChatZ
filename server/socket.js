import { Server as SocketIOServer } from "socket.io";
import Message from "./models/MessageModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User ${userId} connected with socket ID: ${socket.id}`);
    } else {
      console.log("User ID not provided in socket connection.");
    }
  
    // Define the function inside the connection scope
    socket.on("sendMessage", async (message) => {
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);
  
      const createdMessage = await Message.create(message);
  
      const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "id email fullName image")
        .populate("recipient", "id email fullName image");
  
      if (recipientSocketId) {
          io.to(recipientSocketId).emit("receiveMessage", messageData);
          console.log(`Message sent to recipient: ${message.recipient}`);
      }
      if (senderSocketId){
          io.to(senderSocketId).emit("receiveMessage", messageData);
          console.log(`Message sent to sender: ${message.sender}`);
      }
    });
  
    socket.on("disconnect", () => {
      disconnect(socket);
    });
  });
}  

export default setupSocket;
