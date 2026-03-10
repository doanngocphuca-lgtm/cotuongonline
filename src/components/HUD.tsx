import React from 'react';
import { motion } from 'motion/react';
import { RotateCcw, Settings, Undo2, Trophy, Hash } from 'lucide-react';
import { Player } from '../logic/XiangqiEngine';

interface HUDProps {
  currentPlayer: Player;
  moveCount: number;
  onUndo: () => void;
  onRestart: () => void;
  onBack: () => void;
  onSettings: () => void;
  mode: string;
  winner: Player | 'draw' | null;
  roomCode?: string;
  onlineRole?: Player | null;
}

export const HUD: React.FC<HUDProps> = ({ 
  currentPlayer, 
  moveCount, 
  onUndo, 
  onRestart, 
  onBack, 
  onSettings,
  mode, 
  winner,
  roomCode,
  onlineRole
}) => {
  return (
    <div className="flex flex-col gap-6 w-full lg:w-80 z-20">
      {/* Player Turn Indicator (Mobile/Top) */}
      <div className="lg:hidden flex justify-center mb-4">
        <TurnIndicator player={currentPlayer} />
      </div>

      {/* Game Info Panel */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-3xl p-6 space-y-8"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-display font-bold tracking-[0.2em] text-stone-500 uppercase">
            Battle Intel
          </h3>
          <div className="flex items-center gap-2 text-game-red">
            <Hash size={14} />
            <span className="font-mono font-bold">{moveCount}</span>
          </div>
        </div>

        {/* Player Profiles */}
        <div className="space-y-4">
          <PlayerProfile 
            name={mode === 'online' && onlineRole === 'red' ? "You (Red)" : "Red General"} 
            player="red" 
            isActive={currentPlayer === 'red'} 
          />
          <div className="h-px bg-white/5 mx-4" />
          <PlayerProfile 
            name={mode === 'ai' ? "AI Strategist" : (mode === 'online' && onlineRole === 'black' ? "You (Black)" : "Black General")} 
            player="black" 
            isActive={currentPlayer === 'black'} 
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <ActionButton icon={<Undo2 size={18} />} label="Undo" onClick={onUndo} />
          <ActionButton icon={<RotateCcw size={18} />} label="Restart" onClick={onRestart} />
          <ActionButton icon={<Settings size={18} />} label="Settings" onClick={onSettings} />
          <ActionButton icon={<Trophy size={18} />} label="Quit" onClick={onBack} variant="danger" />
        </div>
      </motion.div>

      {/* Room Info (Online Only) */}
      {mode === 'online' && roomCode && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="backdrop-blur-xl bg-game-gold/10 border border-game-gold/20 shadow-2xl rounded-2xl p-4 space-y-2"
        >
          <div className="text-[10px] font-display tracking-widest text-game-gold uppercase opacity-60">Room Code</div>
          <div className="text-2xl font-mono font-black text-game-gold tracking-widest">{roomCode}</div>
          <div className="flex items-center gap-2 text-[10px] text-stone-400 uppercase tracking-tighter">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Connected
          </div>
        </motion.div>
      )}

      {/* Mode Status */}
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl rounded-2xl p-4 flex items-center justify-between"
      >
        <span className="text-xs font-display tracking-widest text-stone-400 uppercase">Mode</span>
        <span className="text-xs font-bold text-game-red uppercase">{mode}</span>
      </motion.div>
    </div>
  );
};

const TurnIndicator = ({ player }: { player: Player }) => (
  <div className="relative">
    <motion.div
      animate={{ 
        scale: [1, 1.05, 1],
        boxShadow: player === 'red' 
          ? ["0 0 20px rgba(220,38,38,0.3)", "0 0 40px rgba(220,38,38,0.6)", "0 0 20px rgba(220,38,38,0.3)"]
          : ["0 0 20px rgba(255,255,255,0.1)", "0 0 40px rgba(255,255,255,0.3)", "0 0 20px rgba(255,255,255,0.1)"]
      }}
      transition={{ duration: 2, repeat: Infinity }}
      className={`px-8 py-3 rounded-full font-display font-bold tracking-[0.3em] text-sm border-2 transition-colors duration-500 ${
        player === 'red' 
          ? "bg-game-red/20 border-game-red text-white" 
          : "bg-white/10 border-white/40 text-white"
      }`}
    >
      {player === 'red' ? "RED'S TURN" : "BLACK'S TURN"}
    </motion.div>
  </div>
);

const PlayerProfile = ({ name, player, isActive }: { name: string, player: Player, isActive: boolean }) => (
  <div className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-500 ${isActive ? 'bg-white/10 ring-1 ring-white/20' : 'opacity-40'}`}>
    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif font-bold border-2 ${
      player === 'red' ? 'bg-game-red/20 border-game-red text-game-red' : 'bg-stone-800 border-stone-600 text-stone-300'
    }`}>
      {player === 'red' ? '帥' : '將'}
    </div>
    <div className="flex flex-col">
      <span className="text-xs font-display tracking-wider text-stone-500 uppercase">Commander</span>
      <span className={`text-sm font-bold tracking-wide ${isActive ? 'text-white' : 'text-stone-400'}`}>{name}</span>
    </div>
    {isActive && (
      <motion.div 
        layoutId="active-indicator"
        className="ml-auto w-2 h-2 rounded-full bg-game-red animate-pulse shadow-[0_0_10px_#dc2626]" 
      />
    )}
  </div>
);

const ActionButton = ({ icon, label, onClick, variant = 'default' }: { icon: React.ReactNode, label: string, onClick: () => void, variant?: 'default' | 'danger' }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border transition-all duration-300 group ${
      variant === 'danger' 
        ? 'bg-red-950/20 border-red-900/50 hover:bg-red-600 hover:border-red-500 text-red-500 hover:text-white' 
        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-stone-400 hover:text-white'
    }`}
  >
    <div className="group-hover:scale-110 transition-transform">{icon}</div>
    <span className="text-[10px] font-display font-bold uppercase tracking-widest">{label}</span>
  </button>
);
