import { io, Socket } from "socket.io-client";

class NetworkManager {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io("http://localhost:3000");

      this.socket.on("connect", () => {
        console.log("Connected:", this.socket?.id);
      });

      this.socket.on("disconnect", () => {
        console.log("Disconnected");
      });
    }
    return this.socket;
  }

  emit(event: string, data?: any) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.emit(event, data);
  }

  on(event: string, callback: (data: any) => void) {
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on(event, callback);
  }
}

export const network = new NetworkManager();