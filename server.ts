import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()
const server = http.createServer(app)

const io = new Server(server,{
  cors:{ origin:"*" }
})

const rooms:any = {}

function generateRoomCode(){
  return Math.floor(100000 + Math.random()*900000).toString()
}

io.on("connection",(socket)=>{

  console.log("Player connected:",socket.id)

  socket.on("createRoom",()=>{

    const code = generateRoomCode()

    rooms[code] = {
      players:[socket.id]
    }

    socket.join(code)

    socket.emit("roomCreated",code)

    console.log("Room created:",code)

  })

  socket.on("joinRoom",(code)=>{

    const room = rooms[code]

    if(!room){
      socket.emit("roomNotFound","Room not found")
      return
    }

    if(room.players.length >= 2){
      socket.emit("roomFull","Room full")
      return
    }

    room.players.push(socket.id)

    socket.join(code)

    console.log("Player joined:",code)

    if(room.players.length === 2){

      const players = room.players

      const colors:any = {}

      colors[players[0]] = "red"
      colors[players[1]] = "black"

      io.to(code).emit("gameStart",{
        players,
        colors
      })

      console.log("Game start:",code)

    }

  })

  socket.on("move",(data)=>{

    socket.to(data.roomCode).emit("moveMade",data.move)

  })

  socket.on("disconnect",()=>{

    console.log("Player disconnected:",socket.id)

    for(const code in rooms){

      if(rooms[code].players.includes(socket.id)){

        io.to(code).emit("playerLeft")

        delete rooms[code]

      }

    }

  })

})

server.listen(3000,()=>{
  console.log("Server running on 3000")
})