import React from 'react';
import { BoardState, Move, Piece, isValidMove } from '../logic/XiangqiEngine';
import { PieceComponent } from './Piece';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface BoardProps {
  board: BoardState;
  selectedPos: { r: number; c: number } | null;
  lastMove: Move | null;
  onSquareClick: (r: number, c: number) => void;
  currentPlayer: 'red' | 'black';
}

export const Board: React.FC<BoardProps> = ({ board, selectedPos, lastMove, onSquareClick, currentPlayer }) => {
  const validMovesForSelected = React.useMemo(() => {
    if (!selectedPos) return [];
    const moves: { r: number; c: number }[] = [];
    for (let r = 0; r < 10; r++) {
      for (let c = 0; c < 9; c++) {
        if (isValidMove(board, selectedPos, { r, c })) {
          moves.push({ r, c });
        }
      }
    }
    return moves;
  }, [board, selectedPos]);

  const isPossibleMove = (r: number, c: number) => {
    return validMovesForSelected.some(m => m.r === r && m.c === c);
  };

  return (
    <div className="relative board-texture p-6 sm:p-8 rounded-xl shadow-[0_50px_100px_rgba(0,0,0,0.8)] border-[12px] border-[#5d2e0c] select-none overflow-hidden">
      {/* Board Surface Lighting */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
      
      {/* Grid Lines Container */}
      <div className="grid grid-cols-8 grid-rows-9 w-[340px] h-[380px] sm:w-[450px] sm:h-[500px] border-2 border-black/80 relative">
        {/* Horizontal Lines */}
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={`h-${i}`}
            className="absolute w-full h-[2px] bg-black/60"
            style={{ top: `${(i / 9) * 100}%` }}
          />
        ))}
        {/* Vertical Lines */}
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={`v-${i}`}
            className={cn(
              "absolute w-[2px] bg-black/60",
              i === 0 || i === 8 ? "h-full" : "h-[44.44%] top-0",
            )}
            style={{ left: `${(i / 8) * 100}%` }}
          />
        ))}
        {/* Bottom vertical lines after river */}
        {Array.from({ length: 7 }).map((_, i) => (
          <div
            key={`v-bottom-${i}`}
            className="absolute w-[2px] bg-black/60 h-[44.44%] bottom-0"
            style={{ left: `${((i + 1) / 8) * 100}%` }}
          />
        ))}

        {/* Palace Diagonals (Black) */}
        <svg className="absolute top-0 left-[37.5%] w-[25%] h-[22.22%] pointer-events-none opacity-60">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="2" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="2" />
        </svg>

        {/* Palace Diagonals (Red) */}
        <svg className="absolute bottom-0 left-[37.5%] w-[25%] h-[22.22%] pointer-events-none opacity-60">
          <line x1="0" y1="0" x2="100%" y2="100%" stroke="black" strokeWidth="2" />
          <line x1="100%" y1="0" x2="0" y2="100%" stroke="black" strokeWidth="2" />
        </svg>

        {/* River Label */}
        <div className="absolute top-[44.44%] left-0 w-full h-[11.11%] flex items-center justify-around pointer-events-none">
          <span className="text-2xl font-serif font-bold text-black/40 rotate-180 tracking-[0.5em]">楚河</span>
          <span className="text-2xl font-serif font-bold text-black/40 tracking-[0.5em]">漢界</span>
        </div>

        {/* Interaction Layer */}
        <div className="absolute inset-0 grid grid-cols-9 grid-rows-10 -m-5 sm:-m-7">
          {board.map((row, r) =>
            row.map((piece, c) => (
              <div
                key={`${r}-${c}`}
                className="relative flex items-center justify-center"
                onClick={() => onSquareClick(r, c)}
              >
                <AnimatePresence>
                  {isPossibleMove(r, c) && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute w-4 h-4 bg-game-gold/40 rounded-full z-0 shadow-[0_0_10px_rgba(251,191,36,0.5)]"
                    />
                  )}
                </AnimatePresence>
                
                {piece && (
                  <PieceComponent
                    piece={piece}
                    isSelected={selectedPos?.r === r && selectedPos?.c === c}
                    isLastMove={lastMove?.from.r === r && lastMove?.from.c === c || lastMove?.to.r === r && lastMove?.to.c === c}
                  />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
