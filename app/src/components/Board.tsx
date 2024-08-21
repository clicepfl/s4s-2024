// component that takes in a checkers board (csv, M for man and K for king)
// and renders it

import React, { useState } from "react";
import {
  Board as BoardState,
  Piece,
  Player,
  PieceType,
  emptyBoard,
} from "./../pages/api/models";
import {
  calculateBoardAfterMove,
  calculatePossibleMoves,
  MoveWithTakenAndRaffle,
} from "@/util/checkersCalculator";

type BoardProps = {
  player: Player;
};

const testInitialBoard: BoardState = [
  [
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
  ],
  [
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
  ],
  [
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    null,
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
  ],
  [
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
  ],
  [null, null, null, null, null, null, null, null, null, null],
  [
    null,
    null,
    { player: Player.Black, type: PieceType.Man },
    null,
    null,
    null,
    null,
    null,
    null,
    null,
  ],
  [
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
  ],
  [
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
  ],
  [
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
  ],
  [
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
    { player: Player.White, type: PieceType.Man },
    null,
  ],
];

export default function Board({ player }: BoardProps) {
  const [board, setBoard] = useState(testInitialBoard);

  const [selectedPiece, setSelectedPiece] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<MoveWithTakenAndRaffle[]>(
    []
  );

  function handleClick(x: number, y: number) {
    const clickedPiece = board[y][x];
    if (clickedPiece != null && clickedPiece.player == player) {
      // select piece
      setSelectedPiece({ x, y });
      setPossibleMoves(calculatePossibleMoves(board, clickedPiece, x, y));
    } else if (selectedPiece != null) {
      const piece = board[selectedPiece.y][selectedPiece.x];
      if (piece != null) {
        let playedMove = possibleMoves.find(
          (move) => move.x == x && move.y == y
        );
        if (playedMove != null) {
          let nextBoard = calculateBoardAfterMove(
            board,
            playedMove,
            selectedPiece.x,
            selectedPiece.y
          );
          // move piece
          setBoard(nextBoard);
          if (playedMove.raffle) {
            setSelectedPiece({ x, y });
            setPossibleMoves(calculatePossibleMoves(nextBoard, piece, x, y));
          } else {
            setSelectedPiece(null);
            setPossibleMoves([]);
            // TODO : Call AI to move
          }
        } else {
          setSelectedPiece(null);
          setPossibleMoves([]);
        }
      }
    } else {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  }

  return (
    <div className="board">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((cell, cellIndex) => (
            <div
              key={cellIndex}
              className={`cell 
              ${cellIndex % 2 === rowIndex % 2 ? "whitecell" : "blackcell"}
              ${
                selectedPiece?.y === rowIndex && selectedPiece?.x === cellIndex
                  ? "selected"
                  : ""
              }
              ${
                possibleMoves.find(
                  (move) => move.y === rowIndex && move.x === cellIndex
                )
                  ? "possible"
                  : ""
              }`}
              onClick={() => handleClick(cellIndex, rowIndex)}
            >
              {cell == null ? (
                ""
              ) : (
                <div className={`piece ${cell.player}`}>
                  {cell.type == PieceType.King ? (
                    <div className="crown"></div>
                  ) : (
                    ""
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
