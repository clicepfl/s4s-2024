// component that takes in a checkers board (csv, M for man and K for king)
// and renders it

import React from "react";

type BoardProps = {
  boardState: string;
};

export default function Board({ boardState }: BoardProps) {
  const renderBoard = () => {
    // Parse the CSV board state into a 2D array
    const board = boardState.split("\n").map((row) => row.split(","));

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
                {cell === "" ? (
                  ""
                ) : (
                  <div className={`piece ${cell.split("").join(" ")}`}>
                    {cell.indexOf("K") != -1 ? (
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
