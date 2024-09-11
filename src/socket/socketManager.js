let io;
const userSockets = {}; // store the mapping of userId to socket.id

const initSocket = (socketIo) => {
  io = socketIo;

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);
    
    // This event will be emitted when the user connects, passing userId
    socket.on("joinRoom", (userId) => {
      console.log(`User ${userId} joined room ${userId}`);
      socket.join(userId); // User joins a room named by their userId
      userSockets[userId] = socket.id; // Store the mapping
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);

      // Remove the user from userSockets when they disconnect
      for (const [userId, socketId] of Object.entries(userSockets)) {
        if (socketId === socket.id) {
          delete userSockets[userId];
          break;
        }
      }
    });
  });
};

// Emit like update to the post owner
const emitLikeUpdate = (postOwnerId, data) => {
  if (io) {
    const socketID = userSockets[postOwnerId.toString()] 
    // Emit the like update only to the post owner's room
    io.to(socketID).emit("likeUpdate", data);
    console.log(postOwnerId.toString());
    console.log(
      `Like update emitted to user ${postOwnerId} for post ${data.postId}`
    );
  } else {
    console.error("Socket.io not initialized");
  }
};

// Function to emit comment update to the post owner
const emitCommentUpdate = (postOwnerId, data) => {
  if (io) {
    console.log(postOwnerId.toString(),"comment update post owner")
    const socketID = userSockets[postOwnerId.toString()] 
    console.log(socketID,"comment update id")
    // Emit the comment update only to the post owner's room
    io.to(socketID).emit("commentUpdate", data);
    console.log(
      `Comment update emitted to user ${postOwnerId} for post ${data.postId}`
    );
  } else {
    console.error("Socket.io not initialized");
  }
};

export { initSocket, emitLikeUpdate, emitCommentUpdate };
