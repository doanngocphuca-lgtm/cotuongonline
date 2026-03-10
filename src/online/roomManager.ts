import { network } from "./network"

class RoomManager {

  private roomCode: string = ""
  private isHost: boolean = false

  private onRoomCreated?: (code: string) => void
  private onGameStart?: (data: any) => void
  private onRoomNotFound?: (msg: string) => void
  private onRoomClosed?: (msg: string) => void
  private onPlayerLeft?: () => void

  constructor() {

    // đảm bảo socket connect
    network.connect()

    this.setupListeners()

  }

  private setupListeners() {

    network.on("roomCreated", (code: string) => {

      console.log("Room created:", code)

      this.roomCode = code
      this.isHost = true

      if (this.onRoomCreated) {
        this.onRoomCreated(code)
      }

    })

    network.on("gameStart", (data: any) => {

      console.log("Game start:", data)

      if (this.onGameStart) {
        this.onGameStart(data)
      }

    })

    network.on("roomNotFound", (msg: string) => {

      console.log("Room not found:", msg)

      if (this.onRoomNotFound) {
        this.onRoomNotFound(msg)
      }

    })

    network.on("roomClosed", (msg: string) => {

      console.log("Room closed:", msg)

      this.roomCode = ""
      this.isHost = false

      if (this.onRoomClosed) {
        this.onRoomClosed(msg)
      }

    })

    network.on("playerLeft", () => {

      console.log("Player left")

      if (this.onPlayerLeft) {
        this.onPlayerLeft()
      }

    })

  }

  createRoom() {

    console.log("Emit createRoom")

    network.emit("createRoom")

  }

  joinRoom(code: string) {

    console.log("Emit joinRoom:", code)

    this.roomCode = code
    this.isHost = false

    network.emit("joinRoom", code)

  }

  leaveRoom() {

    if (this.roomCode) {

      console.log("Leave room:", this.roomCode)

      network.emit("leaveRoom", this.roomCode)

      this.roomCode = ""
      this.isHost = false

    }

  }

  setCallbacks(callbacks: {

    onRoomCreated?: (code: string) => void
    onGameStart?: (data: any) => void
    onRoomNotFound?: (msg: string) => void
    onRoomClosed?: (msg: string) => void
    onPlayerLeft?: () => void

  }) {

    this.onRoomCreated = callbacks.onRoomCreated
    this.onGameStart = callbacks.onGameStart
    this.onRoomNotFound = callbacks.onRoomNotFound
    this.onRoomClosed = callbacks.onRoomClosed
    this.onPlayerLeft = callbacks.onPlayerLeft

  }

  getRoomCode() {
    return this.roomCode
  }

  getIsHost() {
    return this.isHost
  }

}

export const roomManager = new RoomManager()