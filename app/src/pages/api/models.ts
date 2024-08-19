export interface GameState {
  board: Board;
  current_player: Player;
}

export type Board = (Piece | null)[][];

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