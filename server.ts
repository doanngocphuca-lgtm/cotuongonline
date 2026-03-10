import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const rooms:any = {};

function generateRoomCode(){
  return Math.floor(100000 + Math.random()*900000).toString();
}

io.on("connection", (socket) => {

  console.log("Player connected:", socket.id);

  socket.on("createRoom", () => {

    const roomCode = generateRoomCode();

    rooms[roomCode] = { players:[socket.id] };

    socket.join(roomCode);

    socket.emit("roomCreated", roomCode);

  });

  socket.on("joinRoom",(code)=>{

    if(!rooms[code]){
      socket.emit("roomNotFound","Room not found");
      return;
    }

    rooms[code].players.push(socket.id);

    socket.join(code);

    io.to(code).emit("gameStart",{room:code});

  });

});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});