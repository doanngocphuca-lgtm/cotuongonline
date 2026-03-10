import React, { useEffect, useState } from "react";
import { roomManager } from "../online/roomManager";

interface OnlineMenuProps {
  onBack: () => void
  onGameStart: () => void
}

export const OnlineMenu: React.FC<OnlineMenuProps> = ({
  onBack,
  onGameStart
}) => {

  const [roomCode, setRoomCode] = useState("")
  const [joinCode, setJoinCode] = useState("")
  const [inRoom, setInRoom] = useState(false)

  useEffect(() => {

    roomManager.setCallbacks({

      onRoomCreated: (code) => {
        setRoomCode(code)
        setInRoom(true)
      },

      onGameStart: () => {
        onGameStart()
      }

    })

  }, [])

  // ROOM LOBBY
  if (inRoom) {

    return (
      <div className="flex flex-col items-center justify-center h-screen text-white">

        <h2 className="text-3xl mb-4">Room Created</h2>

        <h1 className="text-6xl text-red-500">{roomCode}</h1>

        <p className="mt-4">Share this code with your opponent</p>

        <p className="mt-2 opacity-60">Waiting for player...</p>

        <button
          onClick={onBack}
          className="mt-6 px-6 py-2 bg-gray-700 rounded-lg"
        >
          Back
        </button>

      </div>
    )
  }

  // CREATE / JOIN MENU
  return (

    <div className="flex flex-col items-center justify-center h-screen gap-4 text-white">

      <h1 className="text-4xl mb-6">ONLINE PLAY</h1>

      <button
        onClick={() => roomManager.createRoom()}
        className="bg-red-500 px-6 py-3 rounded-lg"
      >
        Create Room
      </button>

      <input
        value={joinCode}
        onChange={(e) => setJoinCode(e.target.value)}
        placeholder="Enter Room Code"
        className="px-4 py-2 text-black"
      />

      <button
        onClick={() => roomManager.joinRoom(joinCode)}
        className="bg-gray-700 px-6 py-3 rounded-lg"
      >
        Join Room
      </button>

      <button
        onClick={onBack}
        className="mt-6 px-6 py-2 bg-gray-600 rounded-lg"
      >
        Back
      </button>

    </div>
  )

}