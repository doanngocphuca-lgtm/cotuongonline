export type Player = 'red' | 'black';

export enum PieceType {
  KING = 'king',
  ADVISOR = 'advisor',
  ELEPHANT = 'elephant',
  HORSE = 'horse',
  CHARIOT = 'chariot',
  CANNON = 'cannon',
  SOLDIER = 'soldier'
}

export interface Piece {
  type: PieceType;
  player: Player;
  id: string;
}

export type BoardState = (Piece | null)[][];

export interface Move {
  from: { r: number; c: number };
  to: { r: number; c: number };
  captured?: Piece;
}

export const INITIAL_BOARD: BoardState = [
  // Row 0 (Black)
  [
    { type: PieceType.CHARIOT, player: 'black', id: 'b_c1' },
    { type: PieceType.HORSE, player: 'black', id: 'b_h1' },
    { type: PieceType.ELEPHANT, player: 'black', id: 'b_e1' },
    { type: PieceType.ADVISOR, player: 'black', id: 'b_a1' },
    { type: PieceType.KING, player: 'black', id: 'b_k' },
    { type: PieceType.ADVISOR, player: 'black', id: 'b_a2' },
    { type: PieceType.ELEPHANT, player: 'black', id: 'b_e2' },
    { type: PieceType.HORSE, player: 'black', id: 'b_h2' },
    { type: PieceType.CHARIOT, player: 'black', id: 'b_c2' },
  ],
  [null, null, null, null, null, null, null, null, null],
  [
    null,
    { type: PieceType.CANNON, player: 'black', id: 'b_cn1' },
    null,
    null,
    null,
    null,
    null,
    { type: PieceType.CANNON, player: 'black', id: 'b_cn2' },
    null,
  ],
  [
    { type: PieceType.SOLDIER, player: 'black', id: 'b_s1' },
    null,
    { type: PieceType.SOLDIER, player: 'black', id: 'b_s2' },
    null,
    { type: PieceType.SOLDIER, player: 'black', id: 'b_s3' },
    null,
    { type: PieceType.SOLDIER, player: 'black', id: 'b_s4' },
    null,
    { type: PieceType.SOLDIER, player: 'black', id: 'b_s5' },
  ],
  [null, null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null, null],
  [
    { type: PieceType.SOLDIER, player: 'red', id: 'r_s1' },
    null,
    { type: PieceType.SOLDIER, player: 'red', id: 'r_s2' },
    null,
    { type: PieceType.SOLDIER, player: 'red', id: 'r_s3' },
    null,
    { type: PieceType.SOLDIER, player: 'red', id: 'r_s4' },
    null,
    { type: PieceType.SOLDIER, player: 'red', id: 'r_s5' },
  ],
  [
    null,
    { type: PieceType.CANNON, player: 'red', id: 'r_cn1' },
    null,
    null,
    null,
    null,
    null,
    { type: PieceType.CANNON, player: 'red', id: 'r_cn2' },
    null,
  ],
  [null, null, null, null, null, null, null, null, null],
  [
    { type: PieceType.CHARIOT, player: 'red', id: 'r_c1' },
    { type: PieceType.HORSE, player: 'red', id: 'r_h1' },
    { type: PieceType.ELEPHANT, player: 'red', id: 'r_e1' },
    { type: PieceType.ADVISOR, player: 'red', id: 'r_a1' },
    { type: PieceType.KING, player: 'red', id: 'r_k' },
    { type: PieceType.ADVISOR, player: 'red', id: 'r_a2' },
    { type: PieceType.ELEPHANT, player: 'red', id: 'r_e2' },
    { type: PieceType.HORSE, player: 'red', id: 'r_h2' },
    { type: PieceType.CHARIOT, player: 'red', id: 'r_c2' },
  ],
];

export function isValidMove(board: BoardState, from: { r: number; c: number }, to: { r: number; c: number }): boolean {
  const piece = board[from.r][from.c];
  if (!piece) return false;

  const target = board[to.r][to.c];
  if (target && target.player === piece.player) return false;

  const dr = to.r - from.r;
  const dc = to.c - from.c;
  const absDr = Math.abs(dr);
  const absDc = Math.abs(dc);

  switch (piece.type) {
    case PieceType.KING:
      // King: 1 step orthogonal, within palace (3x3)
      if (absDr + absDc !== 1) return false;
      if (to.c < 3 || to.c > 5) return false;
      if (piece.player === 'red') {
        if (to.r < 7 || to.r > 9) return false;
      } else {
        if (to.r < 0 || to.r > 2) return false;
      }
      return true;

    case PieceType.ADVISOR:
      // Advisor: 1 step diagonal, within palace
      if (absDr !== 1 || absDc !== 1) return false;
      if (to.c < 3 || to.c > 5) return false;
      if (piece.player === 'red') {
        if (to.r < 7 || to.r > 9) return false;
      } else {
        if (to.r < 0 || to.r > 2) return false;
      }
      return true;

    case PieceType.ELEPHANT:
      // Elephant: 2 steps diagonal, cannot cross river, cannot jump over pieces
      if (absDr !== 2 || absDc !== 2) return false;
      // River check
      if (piece.player === 'red' && to.r < 5) return false;
      if (piece.player === 'black' && to.r > 4) return false;
      // Eye check (blocking piece)
      if (board[from.r + dr / 2][from.c + dc / 2]) return false;
      return true;

    case PieceType.HORSE:
      // Horse: L-shape, cannot jump (blocking piece at "elbow")
      if (!((absDr === 2 && absDc === 1) || (absDr === 1 && absDc === 2))) return false;
      if (absDr === 2) {
        if (board[from.r + dr / 2][from.c]) return false;
      } else {
        if (board[from.r][from.c + dc / 2]) return false;
      }
      return true;

    case PieceType.CHARIOT:
      // Chariot: Orthogonal, any distance, no pieces in between
      if (dr !== 0 && dc !== 0) return false;
      if (dr === 0) {
        const step = dc > 0 ? 1 : -1;
        for (let c = from.c + step; c !== to.c; c += step) {
          if (board[from.r][c]) return false;
        }
      } else {
        const step = dr > 0 ? 1 : -1;
        for (let r = from.r + step; r !== to.r; r += step) {
          if (board[r][from.c]) return false;
        }
      }
      return true;

    case PieceType.CANNON:
      // Cannon: Orthogonal, any distance. To capture: exactly 1 piece in between. To move: 0 pieces in between.
      if (dr !== 0 && dc !== 0) return false;
      let count = 0;
      if (dr === 0) {
        const step = dc > 0 ? 1 : -1;
        for (let c = from.c + step; c !== to.c; c += step) {
          if (board[from.r][c]) count++;
        }
      } else {
        const step = dr > 0 ? 1 : -1;
        for (let r = from.r + step; r !== to.r; r += step) {
          if (board[r][from.c]) count++;
        }
      }
      if (target) return count === 1;
      return count === 0;

    case PieceType.SOLDIER:
      // Soldier: 1 step forward. After river: can also move sideways.
      if (piece.player === 'red') {
        if (dr === -1 && dc === 0) return true;
        if (from.r <= 4 && dr === 0 && absDc === 1) return true;
      } else {
        if (dr === 1 && dc === 0) return true;
        if (from.r >= 5 && dr === 0 && absDc === 1) return true;
      }
      return false;

    default:
      return false;
  }
}

export function getValidMoves(board: BoardState, player: Player): Move[] {
  const moves: Move[] = [];
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const piece = board[r][c];
      if (piece && piece.player === player) {
        for (let tr = 0; tr < 10; tr++) {
          for (let tc = 0; tc < 9; tc++) {
            if (isValidMove(board, { r, c }, { r: tr, c: tc })) {
              moves.push({ from: { r, c }, to: { r: tr, c: tc }, captured: board[tr][tc] || undefined });
            }
          }
        }
      }
    }
  }
  return moves;
}

export function applyMove(board: BoardState, move: Move): BoardState {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[move.from.r][move.from.c];
  newBoard[move.to.r][move.to.c] = piece;
  newBoard[move.from.r][move.from.c] = null;
  return newBoard;
}

export function isGameOver(board: BoardState): Player | 'draw' | null {
  let redKing = false;
  let blackKing = false;
  for (let r = 0; r < 10; r++) {
    for (let c = 0; c < 9; c++) {
      const p = board[r][c];
      if (p?.type === PieceType.KING) {
        if (p.player === 'red') redKing = true;
        else blackKing = true;
      }
    }
  }
  if (!redKing) return 'black';
  if (!blackKing) return 'red';
  return null;
}
