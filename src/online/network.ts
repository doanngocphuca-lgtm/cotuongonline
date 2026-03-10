import { io, Socket } from "socket.io-client"

class NetworkManager {

  private socket: Socket | null = null

  connect(){

    if(!this.socket){

      this.socket = io("https://cotuongonline.onrender.com",{
        transports:["websocket"]
      })

      this.socket.on("connect",()=>{
        console.log("Connected:",this.socket?.id)
      })

      this.socket.on("disconnect",()=>{
        console.log("Disconnected")
      })

      this.socket.on("connect_error",(err)=>{
        console.error("Socket error:",err)
      })

    }

    return this.socket

  }

  disconnect(){

    if(this.socket){

      this.socket.disconnect()
      this.socket = null

    }

  }

  emit(event:string,data?:any){

    if(!this.socket){
      this.connect()
    }

    this.socket?.emit(event,data)

  }

  on(event:string,callback:(data:any)=>void){

    if(!this.socket){
      this.connect()
    }

    this.socket?.on(event,callback)

  }

}

export const network = new NetworkManager()