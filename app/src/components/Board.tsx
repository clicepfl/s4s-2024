// component that takes in a checkers board (csv, M for man and K for king)
// and renders it

import React from "react";
import { Board as BoardState, Piece, Player, PieceType } from "./../pages/api/models";

type BoardProps = {
  board: BoardState;
};

export default function Board({ board }: BoardProps) {
  const renderBoard = () => {

    // Render the checkers board
    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                className={`cell ${
                  cellIndex % 2 === rowIndex % 2 ? "whitecell" : "blackcell"
                }`}
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
  };

  return <div>{renderBoard()}</div>;
}
