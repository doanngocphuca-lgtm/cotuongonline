import express from "express"
import http from "http"
import { Server } from "socket.io"

const app = express()

// route test server
app.get("/", (req, res) => {
  res.send("Xiangqi Online Server Running")
})

const server = http.createServer(app)

const io = new Server(server,{
  cors:{
    origin:"*"
  }
})

const rooms:any = {}

function generateRoomCode(){
  return Math.floor(100000 + Math.random()*900000).toString()
}

io.on("connection",(socket)=>{

  console.log("Player connected:",socket.id)

  // create room
  socket.on("createRoom",()=>{

    const code = generateRoomCode()

    rooms[code] = {
      players:[socket.id]
    }

    socket.join(code)

    socket.emit("roomCreated",code)

    console.log("Room created:",code)

  })

  // join room
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

    // start game
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

  // move piece
  socket.on("move",(data)=>{

    const {roomCode,move} = data

    socket.to(roomCode).emit("moveMade",move)

  })

  // leave room
  socket.on("leaveRoom",(code)=>{

    socket.leave(code)

    if(rooms[code]){
      rooms[code].players =
        rooms[code].players.filter((id:string)=>id !== socket.id)
    }

  })

  // disconnect
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

const PORT = process.env.PORT || 3000

server.listen(PORT,()=>{

  console.log("Server running on",PORT)

})