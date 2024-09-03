// component that takes in a checkers board (csv, M for man and K for king)
// and renders it

import React, { use, useEffect, useState } from "react";
import {
  Board as BoardState,
  Piece,
  Player,
  PieceType,
  emptyBoard,
  initialBoards,
  MoveSequence,
  SingleMove,
} from "../api/models";
import {
  calculateBoardAfterMove,
  calculatePossibleMoves,
  MoveWithTakenAndRaffle,
} from "@/util/checkersCalculator";
import { makeMove } from "@/api/api";

type BoardProps = {
  username: string;
  player: Player;
  gameOngoing: boolean;
  currentTurn: Player | null;
  setCurrentTurn: (player: Player) => void;
  board: BoardState;
  setBoard: (board: BoardState) => void;
};

export default function Board({
  username,
  player,
  gameOngoing,
  currentTurn,
  setCurrentTurn,
  board, 
  setBoard,
}: BoardProps) {
  
  const [currentMoveSequence, setCurrentMoveSequence] = useState<MoveSequence>(
    []
  );

  useEffect(() => {
    setBoard(initialBoards[player]);
  }, [player]); // player can only change when the game is not ongoing

  const [selectedPiece, setSelectedPiece] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<MoveWithTakenAndRaffle[]>(
    []
  );

  // handle click on a cell
  function handleClick(x: number, y: number) {
    if (!gameOngoing || currentTurn != player) {
      setSelectedPiece(null);
      setPossibleMoves([]);
      return;
    }
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
          // add move to current sequence
          let singleMove: SingleMove = {
            from: [selectedPiece.x, selectedPiece.y],
            to: [x, y],
          };
          let newMoveSequence = currentMoveSequence.concat(singleMove);
          setCurrentMoveSequence(newMoveSequence);

          // move piece on board
          let nextBoard = calculateBoardAfterMove(
            board,
            playedMove,
            selectedPiece.x,
            selectedPiece.y
          );
          setBoard(nextBoard);

          // check if the move sequence is finished
          if (playedMove.raffle) {
            setSelectedPiece({ x, y });
            setPossibleMoves(calculatePossibleMoves(nextBoard, piece, x, y));
          } else {
            setSelectedPiece(null);
            setPossibleMoves([]);
            setCurrentTurn(
              player == Player.White ? Player.Black : Player.White
            ); // switch turn
            makeMove(newMoveSequence, username).then(
              (turnStatus) => {
                if (turnStatus instanceof Error) {
                  alert(turnStatus.message);
                } else {
                  // TODO: add buffer time before updating board ?
                  setBoard(turnStatus.game.board); // update board with server response
                  setCurrentTurn(turnStatus.game.current_player);
                }
              },
              (error) => {
                console.error(error);
              }
            ); // send move to server
            setCurrentMoveSequence([]); // reset move sequence
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
