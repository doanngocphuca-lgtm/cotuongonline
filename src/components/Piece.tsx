import React from 'react';
import { Piece, PieceType } from '../logic/XiangqiEngine';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface PieceProps {
  piece: Piece;
  isSelected?: boolean;
  isLastMove?: boolean;
  onClick?: () => void;
}

const PIECE_LABELS: Record<PieceType, Record<'red' | 'black', string>> = {
  [PieceType.KING]: { red: '帥', black: '將' },
  [PieceType.ADVISOR]: { red: '仕', black: '士' },
  [PieceType.ELEPHANT]: { red: '相', black: '象' },
  [PieceType.HORSE]: { red: '傌', black: '馬' },
  [PieceType.CHARIOT]: { red: '俥', black: '車' },
  [PieceType.CANNON]: { red: '炮', black: '砲' },
  [PieceType.SOLDIER]: { red: '兵', black: '卒' },
};

export const PieceComponent: React.FC<PieceProps> = ({ piece, isSelected, isLastMove, onClick }) => {
  const isRed = piece.player === 'red';

  return (
    <motion.div
      layoutId={piece.id}
      onClick={onClick}
      initial={false}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={cn(
        "relative w-11 h-11 sm:w-14 sm:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 select-none",
        "border-2 shadow-[0_5px_15px_rgba(0,0,0,0.5)] transform",
        isRed 
          ? "bg-gradient-to-b from-red-50 to-red-200 border-red-800 text-red-800" 
          : "bg-gradient-to-b from-stone-700 to-stone-900 border-stone-600 text-stone-200",
        isSelected && "ring-4 ring-game-gold scale-110 z-20 shadow-[0_0_30px_rgba(251,191,36,0.6)]",
        isLastMove && "ring-2 ring-blue-500/50"
      )}
    >
      {/* 3D Inner Shadow */}
      <div className="absolute inset-0 rounded-full shadow-[inset_0_2px_4px_rgba(255,255,255,0.5),inset_0_-2px_4px_rgba(0,0,0,0.3)] pointer-events-none" />
      
      {/* Character */}
      <span className="text-2xl sm:text-3xl font-bold font-serif relative z-10 drop-shadow-sm">
        {PIECE_LABELS[piece.type][piece.player]}
      </span>
      
      {/* Decorative Ring */}
      <div className={cn(
        "absolute inset-1.5 rounded-full border pointer-events-none",
        isRed ? "border-red-800/20" : "border-stone-400/10"
      )} />

      {/* Selection Glow */}
      {isSelected && (
        <motion.div
          layoutId="selection-glow"
          className="absolute -inset-2 rounded-full border-2 border-game-gold/30 animate-pulse"
        />
      )}
    </motion.div>
  );
};
