import { network } from "./network";

export class RoomManager {
  private roomCode: string = "";
  private isHost: boolean = false;

  private onRoomCreated?: (code: string) => void;
  private onGameStart?: (data: any) => void;
  private onRoomNotFound?: (msg: string) => void;
  private onRoomClosed?: (msg: string) => void;
  private onPlayerLeft?: (id: string) => void;

  constructor() {
    // đảm bảo socket connect
    network.connect();

    this.setupListeners();
  }

  private setupListeners() {

    network.on("roomCreated", (code: string) => {
      console.log("Room created:", code);

      this.roomCode = code;
      this.isHost = true;

      this.onRoomCreated?.(code);
    });

    network.on("gameStart", (data: any) => {
      console.log("Game started");

      this.onGameStart?.(data);
    });

    network.on("roomNotFound", (msg: string) => {
      console.log("Room not found");

      this.onRoomNotFound?.(msg);
    });

    network.on("roomClosed", (msg: string) => {
      console.log("Room closed");

      this.onRoomClosed?.(msg);
    });

    network.on("playerLeft", (id: string) => {
      console.log("Player left:", id);

      this.onPlayerLeft?.(id);
    });
  }

  createRoom() {
    console.log("Create Room clicked");

    network.emit("createRoom");
  }

  joinRoom(code: string) {
    console.log("Join room:", code);

    network.emit("joinRoom", code);
  }

  leaveRoom() {
    if (!this.roomCode) return;

    console.log("Leaving room:", this.roomCode);

    network.emit("leaveRoom", this.roomCode);

    this.roomCode = "";
    this.isHost = false;
  }

  setCallbacks(callbacks: {
    onRoomCreated?: (code: string) => void;
    onGameStart?: (data: any) => void;
    onRoomNotFound?: (msg: string) => void;
    onRoomClosed?: (msg: string) => void;
    onPlayerLeft?: (id: string) => void;
  }) {
    this.onRoomCreated = callbacks.onRoomCreated;
    this.onGameStart = callbacks.onGameStart;
    this.onRoomNotFound = callbacks.onRoomNotFound;
    this.onRoomClosed = callbacks.onRoomClosed;
    this.onPlayerLeft = callbacks.onPlayerLeft;
  }

  getRoomCode() {
    return this.roomCode;
  }

  isRoomHost() {
    return this.isHost;
  }
}

export const roomManager = new RoomManager();