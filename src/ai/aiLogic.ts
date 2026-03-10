import { BoardState, Move, PieceType, Player, applyMove, getValidMoves, isGameOver } from "../logic/XiangqiEngine";

const PIECE_VALUES: Record<PieceType, number> = {
  [PieceType.KING]: 10000,
  [PieceType.CHARIOT]: 100,
  [PieceType.CANNON]: 45,
  [PieceType.HORSE]: 40,
  [PieceType.ELEPHANT]: 20,
  [PieceType.ADVISOR]: 20,
  [PieceType.SOLDIER]: 10,
};

function evaluateBoard(board: BoardState, player: Player): number {
  let score = 0;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece) {
        const val = PIECE_VALUES[piece.type];
        if (piece.player === player) score += val;
        else score -= val;
      }
    }
  }
  return score;
}

export function getEasyMove(board: BoardState, player: Player): Move | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

export function getMediumMove(board: BoardState, player: Player): Move | null {
  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  // Prioritize captures
  const captureMoves = moves.filter(m => m.captured);
  if (captureMoves.length > 0) {
    return captureMoves.sort((a, b) => PIECE_VALUES[b.captured!.type] - PIECE_VALUES[a.captured!.type])[0];
  }

  return moves[Math.floor(Math.random() * moves.length)];
}

export function getHardMove(board: BoardState, player: Player): Move | null {
  let bestMove: Move | null = null;
  let bestValue = -Infinity;

  const moves = getValidMoves(board, player);
  if (moves.length === 0) return null;

  for (const move of moves) {
    const nextBoard = applyMove(board, move);
    const boardValue = minimax(nextBoard, 3, -Infinity, Infinity, false, player);
    if (boardValue > bestValue) {
      bestValue = boardValue;
      bestMove = move;
    }
  }

  return bestMove;
}

function minimax(
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean,
  player: Player
): number {
  const winner = isGameOver(board);
  if (winner === player) return 10000 + depth;
  if (winner && winner !== player) return -10000 - depth;
  if (depth === 0) return evaluateBoard(board, player);

  const opponent = player === 'red' ? 'black' : 'red';

  if (isMaximizing) {
    let maxEval = -Infinity;
    const moves = getValidMoves(board, player);
    for (const move of moves) {
      const nextBoard = applyMove(board, move);
      const evalValue = minimax(nextBoard, depth - 1, alpha, beta, false, player);
      maxEval = Math.max(maxEval, evalValue);
      alpha = Math.max(alpha, evalValue);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    const moves = getValidMoves(board, opponent);
    for (const move of moves) {
      const nextBoard = applyMove(board, move);
      const evalValue = minimax(nextBoard, depth - 1, alpha, beta, true, player);
      minEval = Math.min(minEval, evalValue);
      beta = Math.min(beta, evalValue);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}
