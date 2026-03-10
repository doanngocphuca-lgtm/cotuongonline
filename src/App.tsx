import React, { useState, useEffect, useCallback } from 'react';
import { Board } from './components/Board';
import { MainMenu } from './components/MainMenu';
import { HUD } from './components/HUD';
import { SettingsMenu } from './components/SettingsMenu';
import { INITIAL_BOARD, BoardState, Move, Player, applyMove, isGameOver, getValidMoves } from './logic/XiangqiEngine';
import { getEasyMove, getMediumMove, getHardMove } from './ai/aiLogic';
import { soundManager, GameSettings } from './services/soundManager';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Globe, Plus, LogIn, X } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

import { network } from './online/network';
import { roomManager } from './online/roomManager';

type GameMode = 'menu' | 'local' | 'ai' | 'online';
type AIDifficulty = 'easy' | 'medium' | 'hard';

export default function App() {
  const [mode, setMode] = useState<GameMode>('menu');
  const [difficulty, setDifficulty] = useState<AIDifficulty>('medium');
  const [board, setBoard] = useState<BoardState>(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState<Player>('red');
  const [selectedPos, setSelectedPos] = useState<{ r: number; c: number } | null>(null);
  const [history, setHistory] = useState<BoardState[]>([]);
  const [lastMove, setLastMove] = useState<Move | null>(null);
  const [winner, setWinner] = useState<Player | 'draw' | null>(null);
  const [roomCode, setRoomCode] = useState('');
  const [onlineRole, setOnlineRole] = useState<Player | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(true);

  // UI States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [onlineMenu, setOnlineMenu] = useState<'none' | 'choice' | 'join' | 'waiting'>('none');
  const [settings, setSettings] = useState<GameSettings>(soundManager.getSettings());

  useEffect(() => {
    if (mode === 'online') {
      const socket = network.connect();

      roomManager.setCallbacks({
        onRoomCreated: (code) => {
          setRoomCode(code);
          setOnlineMenu('waiting');
        },
       onGameStart: (data) => {

  const socket = network.connect()

  const myColor = data.colors[socket.id]

  console.log("My color:", myColor)

  setOnlineRole(myColor)

  setIsMyTurn(myColor === "red")

  setOnlineMenu("none")

  soundManager.play("start")

        },
        onRoomNotFound: (msg) => {
          alert(msg);
          setOnlineMenu('choice');
        },
        onRoomClosed: (msg) => {
          alert(msg);
          backToMenu();
        },
        onPlayerLeft: () => {
          alert("Opponent left the room");
          backToMenu();
        }
      });

      socket.on('moveMade', (move: Move) => {
        handleMove(move, false);
      });

      socket.on('error-msg', (msg: string) => {
        alert(msg);
      });

      return () => {
        network.disconnect();
      };
    }
  }, [mode]);

  const handleMove = useCallback((move: Move, emit = true) => {
    const nextBoard = applyMove(board, move);
    setHistory(prev => [...prev, board]);
    setBoard(nextBoard);
    setLastMove(move);
    
    if (move.captured) soundManager.play('capture');
    else soundManager.play('move');

    const gameWinner = isGameOver(nextBoard);
    if (gameWinner) {
      setWinner(gameWinner);
      soundManager.play('win');
    } else {
      setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
      if (mode === 'online') {
        setIsMyTurn(prev => !prev);
        if (emit) {
          network.emit('move', { roomCode, move });
        }
      }
    }
    setSelectedPos(null);
  }, [board, mode, roomCode]);

  useEffect(() => {
    if (mode === 'ai' && currentPlayer === 'black' && !winner) {
      const timer = setTimeout(() => {
        let move: Move | null = null;
        if (difficulty === 'easy') move = getEasyMove(board, 'black');
        else if (difficulty === 'medium') move = getMediumMove(board, 'black');
        else move = getHardMove(board, 'black');

        if (move) handleMove(move);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [mode, currentPlayer, board, winner, difficulty, handleMove]);

  const onSquareClick = (r: number, c: number) => {
    if (winner) return;
    if (mode === 'online' && !isMyTurn) return;
    if (mode === 'ai' && currentPlayer === 'black') return;

    const piece = board[r][c];

    if (selectedPos) {
      const move: Move = { from: selectedPos, to: { r, c }, captured: board[r][c] || undefined };
      const moves = getValidMoves(board, currentPlayer);
      const isValid = moves.some(m => m.from.r === selectedPos.r && m.from.c === selectedPos.c && m.to.r === r && m.to.c === c);

      if (isValid) {
        handleMove(move);
      } else if (piece && piece.player === currentPlayer) {
        soundManager.play('click');
        setSelectedPos({ r, c });
      } else {
        setSelectedPos(null);
      }
    } else if (piece && piece.player === currentPlayer) {
      soundManager.play('click');
      setSelectedPos({ r, c });
    }
  };

  const undo = () => {
    if (history.length > 0) {
      soundManager.play('click');
      const prevBoard = history[history.length - 1];
      setBoard(prevBoard);
      setHistory(prev => prev.slice(0, -1));
      setCurrentPlayer(prev => prev === 'red' ? 'black' : 'red');
      setWinner(null);
      setLastMove(null);
    }
  };

  const restart = () => {
    soundManager.play('click');
    setBoard(INITIAL_BOARD);
    setCurrentPlayer('red');
    setWinner(null);
    setHistory([]);
    setLastMove(null);
    setSelectedPos(null);
    if (mode === 'online') setIsMyTurn(onlineRole === 'red');
  };

  const backToMenu = () => {
    soundManager.play('click');
    if (mode === 'online' && roomCode) {
      roomManager.leaveRoom();
    }
    setMode('menu');
    setOnlineMenu('none');
    setRoomCode('');
    restart();
  };

  const handleOnlineChoice = (choice: 'create' | 'join') => {

  soundManager.play('click');

  if (choice === 'create') {

    // chuyển sang online mode để kích hoạt socket useEffect
    setMode('online')

    // tạo phòng
    roomManager.createRoom()

  } else {

    setOnlineMenu('join')

  }

}

  return (
    <div className={`min-h-screen ${settings.boardTheme === 'light' ? 'bg-stone-200' : ''}`}>
      <AnimatePresence mode="wait">
        {mode === 'menu' ? (
          <motion.div
            key="menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <MainMenu onSelectMode={(m) => { 
              soundManager.play('click'); 
              if (m === 'online') setOnlineMenu('choice');
              else setMode(m); 
            }} />
          </motion.div>
        ) : (
          <motion.div
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen flex flex-col items-center p-4 lg:p-12"
          >
            {/* Cinematic Background Glows */}
            <div className="fixed inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-game-red/5 blur-[120px] rounded-full" />
              <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-game-gold/5 blur-[120px] rounded-full" />
            </div>

            <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20">
              {/* Board Section */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative"
              >
                <Board 
                  board={board}
                  selectedPos={selectedPos}
                  lastMove={lastMove}
                  onSquareClick={onSquareClick}
                  currentPlayer={currentPlayer}
                />
              </motion.div>

              {/* HUD Section */}
              <HUD 
                currentPlayer={currentPlayer}
                moveCount={history.length}
                onUndo={undo}
                onRestart={restart}
                onBack={backToMenu}
                onSettings={() => { soundManager.play('click'); setIsSettingsOpen(true); }}
                mode={mode}
                winner={winner}
                roomCode={roomCode}
                onlineRole={onlineRole}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Online Popups */}
      <AnimatePresence>
        {onlineMenu !== 'none' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="backdrop-blur-xl bg-stone-900/90 border border-white/10 shadow-2xl rounded-[32px] w-full max-w-sm p-8 text-center"
            >
              <div className="flex justify-between items-center mb-8">
                <Globe className="text-game-gold" size={32} />
                <button onClick={() => setOnlineMenu('none')} className="p-2 hover:bg-white/5 rounded-full"><X /></button>
              </div>

              {onlineMenu === 'choice' && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-display font-bold tracking-widest uppercase mb-6">Online Play</h2>
                  <button 
                    onClick={() => handleOnlineChoice('create')}
                    className="w-full py-4 bg-game-red hover:bg-red-500 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                  >
                    <Plus size={20} /> Create Room
                  </button>
                  <button 
                    onClick={() => handleOnlineChoice('join')}
                    className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all"
                  >
                    <LogIn size={20} /> Join Room
                  </button>
                </div>
              )}

              {onlineMenu === 'join' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold tracking-widest uppercase">Enter Code</h2>
                  <input 
                    id="room-code-input"
                    type="text"
                    maxLength={6}
                    placeholder="000000"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-4xl font-mono font-bold tracking-[0.5em] focus:outline-none focus:border-game-red transition-colors"
                  />
                  <button 
                    onClick={() => {
                      const code = (document.getElementById('room-code-input') as HTMLInputElement).value;
                      if (code.length === 6) {
                        soundManager.play('click');
                        setMode('online');
                        roomManager.joinRoom(code);
                      }
                    }}
                    className="w-full py-4 bg-game-red hover:bg-red-500 rounded-2xl font-bold transition-all"
                  >
                    Connect
                  </button>
                </div>
              )}

              {onlineMenu === 'waiting' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-display font-bold tracking-widest uppercase">Room Ready</h2>
                  <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <div className="text-xs text-stone-500 uppercase tracking-widest mb-2">Share this code</div>
                    <div className="text-5xl font-mono font-black text-game-gold tracking-widest">{roomCode}</div>
                  </div>
                  <div className="flex items-center justify-center gap-3 text-stone-400">
                    <div className="w-2 h-2 bg-game-red rounded-full animate-ping" />
                    <span className="text-sm font-bold uppercase tracking-widest">Waiting for opponent...</span>
                  </div>
                  <button 
                    onClick={() => {
                      soundManager.play('click');
                      roomManager.leaveRoom();
                      setOnlineMenu('none');
                      setRoomCode('');
                    }}
                    className="text-xs font-bold text-stone-500 hover:text-white uppercase tracking-widest"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Menu */}
      <SettingsMenu 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
        onSettingsChange={(s) => setSettings(s)}
      />

      {/* Win Modal */}
      <AnimatePresence>
        {winner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl border-game-red/50 p-12 rounded-[40px] text-center max-w-md w-full shadow-[0_0_100px_rgba(220,38,38,0.4)]"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Trophy className="mx-auto text-game-gold mb-6" size={80} />
              </motion.div>
              
              <h2 className="text-5xl font-display font-black mb-4 glow-red tracking-wider">
                {winner === 'draw' ? "STALEMATE" : `${winner.toUpperCase()} VICTORIOUS`}
              </h2>
              <p className="text-stone-400 font-display tracking-[0.2em] mb-10 text-sm">
                THE BOARD HAS BEEN CONQUERED
              </p>
              
              <button 
                onClick={restart}
                className="w-full py-5 bg-game-red hover:bg-red-500 text-white rounded-2xl font-display font-bold text-lg tracking-[0.2em] transition-all shadow-[0_10px_20px_rgba(220,38,38,0.3)] hover:shadow-[0_15px_30px_rgba(220,38,38,0.5)] flex items-center justify-center gap-3"
              >
                <RotateCcw size={24} /> RE-ENGAGE
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
