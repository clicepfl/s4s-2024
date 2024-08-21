export interface GameState {
  board: Board;
  current_player: Player;
}

export type Board = (Piece | null)[][];

export const emptyBoard: Board = Array.from({ length: 10 }, () => Array(10).fill(null));

export interface Piece {
  type: PieceType;
  player: Player;
}

export enum Player {
  White = "white",
  Black = "black",
}

export enum PieceType {
  Man = "man",
  King = "king",
}

export type MoveSequence = { from: [number, number]; to: [number, number] }[];

export enum SubmissionLanguage {
  Java = "java",
  Cpp = "cpp",
  Python = "python",
}