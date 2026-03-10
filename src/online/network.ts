import { io, Socket } from "socket.io-client"

class NetworkManager {

  private socket: Socket | null = null

  connect(): Socket {

    if (!this.socket) {

      this.socket = io("https://cotuongonline.onrender.com", {
        transports: ["websocket"],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
      })

      this.socket.on("connect", () => {
        console.log("Connected:", this.socket?.id)
      })

      this.socket.on("disconnect", () => {
        console.log("Disconnected")
      })

      this.socket.on("connect_error", (err) => {
        console.error("Socket connection error:", err)
      })

    }

    return this.socket

  }

  disconnect() {

    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }

  }

  emit(event: string, data?: any) {

    if (!this.socket) {
      this.connect()
    }

    this.socket!.emit(event, data)

  }

  on(event: string, callback: (data: any) => void) {

    if (!this.socket) {
      this.connect()
    }

    this.socket!.on(event, callback)

  }

  off(event: string) {

    if (this.socket) {
      this.socket.off(event)
    }

  }

  getSocket() {
    return this.socket
  }

}

export const network = new NetworkManager()