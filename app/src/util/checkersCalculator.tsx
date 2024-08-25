import { Board, Piece, PieceType, Player } from "../api/models";

export type MoveWithTaken = {
  x: number;
  y: number;
  taken: { x: number; y: number } | null;
};
export type MoveWithTakenAndRaffle = {
  x: number;
  y: number;
  taken: { x: number; y: number } | null;
  raffle: boolean;
};

function isWithinBoard(x: number, y: number, board: Board) {
  return y >= 0 && y < board.length && x >= 0 && x < board[y].length;
}

// Calculate the possible moves for a regular piece
function calculateManRegularMoves(board: Board, x: number, y: number) {
  const moves = [];
  let directions = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
  ];

  for (const dir of directions) {
    const newX = x + dir.x;
    const newY = y + dir.y;

    // Check if the new position is within the board boundaries
    if (isWithinBoard(newX, newY, board)) {
      const newCell = board[newY][newX];

      // Check if the new cell is empty
      if (newCell == null) {
        moves.push({ x: newX, y: newY, taken: null });
      }
    }
  }

  return moves;
}

// Calculate the possible take moves for a regular piece
function calculateManTakeMoves(
  board: Board,
  piece: Piece,
  x: number,
  y: number
) {
  const moves = [];
  let directions = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];

  for (const dir of directions) {
    const takenX = x + dir.x;
    const takenY = y + dir.y;
    const newX = x + 2 * dir.x;
    const newY = y + 2 * dir.y;

    // Check if the new position is within the board boundaries
    if (isWithinBoard(newX, newY, board)) {
      const takenCell = board[takenY][takenX];
      const newCell = board[newY][newX];

      // Check if the new cell is an opponent's piece and the next cell is empty
      if (
        takenCell != null &&
        takenCell.player !== piece.player &&
        newCell == null
      ) {
        moves.push({ x: newX, y: newY, taken: { x: takenX, y: takenY } });
      }
    }
  }

  return moves;
}

// Calculate the possible moves for a king
function calculateKingRegularMoves(board: Board, x: number, y: number) {
  const moves = [];
  let directions = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];
  for (const dir of directions) {
    let newX = x + dir.x;
    let newY = y + dir.y;

    // Continue moving in the specified direction until reaching the board boundaries
    while (isWithinBoard(newX, newY, board)) {
      const newCell = board[newY][newX];

      // Check if the new cell is empty
      if (newCell == null) {
        moves.push({ x: newX, y: newY, taken: null });
      } else {
        // Stop moving if there is a piece in the way
        break;
      }

      newX += dir.x;
      newY += dir.y;
    }
  }

  return moves;
}

function calculateKingTakeMoves(
  board: Board,
  piece: Piece,
  x: number,
  y: number
) {
  const moves = [];
  let directions = [
    { x: -1, y: -1 },
    { x: 1, y: -1 },
    { x: -1, y: 1 },
    { x: 1, y: 1 },
  ];
  for (const dir of directions) {
    let takenX = x + dir.x;
    let takenY = y + dir.y;
    let newX = x + 2 * dir.x;
    let newY = y + 2 * dir.y;

    // Continue moving in the specified direction until reaching the board boundaries
    while (isWithinBoard(newX, newY, board)) {
      const takenCell = board[takenY][takenX];
      const newCell = board[newY][newX];

      // Check if the new cell is an opponent's piece and the next cell is empty
      if (
        takenCell != null &&
        takenCell.player !== piece.player &&
        newCell == null
      ) {
        while (isWithinBoard(newX, newY, board)) {
          const nextCell = board[newY][newX];
          // Stop moving if there is a piece in the way
          if (nextCell != null) {
            break;
          }

          console.log("Adding move", newX, newY, takenX, takenY);

          moves.push({ x: newX, y: newY, taken: { x: takenX, y: takenY } });

          newX += dir.x;
          newY += dir.y;
        }
      }

      takenX += dir.x;
      takenY += dir.y;
      newX += dir.x;
      newY += dir.y;
    }
  }

  return moves;
}

function calculateTakeMoves(board: Board, piece: Piece, x: number, y: number) {
  if (piece.type === PieceType.King) {
    return calculateKingTakeMoves(board, piece, x, y);
  } else {
    return calculateManTakeMoves(board, piece, x, y);
  }
}

function calculateRegularMoves(
  board: Board,
  piece: Piece,
  x: number,
  y: number
) {
  if (piece.type === PieceType.King) {
    return calculateKingRegularMoves(board, x, y);
  } else {
    return calculateManRegularMoves(board, x, y);
  }
}

/**
 * Player is always at the bottom of the board
 */
function calculateMoves(
  board: Board,
  piece: Piece,
  x: number,
  y: number
): MoveWithTaken[] {
  // Calculate all possible sequence of moves for a piece, including the sequence's length (priority)
  // Return an array of possible moves
  let moves: MoveWithTaken[] = [];

  // Calculate possible take moves
  const takeMoves = calculateTakeMoves(board, piece, x, y);

  if (takeMoves.length > 0) {
    moves = takeMoves;
  } else {
    // Calculate possible regular moves
    moves = calculateRegularMoves(board, piece, x, y);
  }

  return moves;
}

function calculateMoveSequences(
  board: Board,
  piece: Piece,
  x: number,
  y: number
) {
  const moves = calculateMoves(board, piece, x, y);

  let moveSequences: MoveWithTaken[][] = moves.map((move) => [move]);

  let continueRaffle = true;

  while (continueRaffle) {
    continueRaffle = false;
    let nextMoveSequences: MoveWithTaken[][] = [];

    for (const moveSequence of moveSequences) {
      const lastMove = moveSequence[moveSequence.length - 1];

      // Calculate the board after the move sequence (raffle true so no crowning)
      let newBoard = calculateBoardAfterMove(
        board,
        { ...moveSequence[0], raffle: true },
        x,
        y
      );
      for (let i = 0; i < moveSequence.length - 1; i++) {
        newBoard = calculateBoardAfterMove(
          newBoard,
          { ...moveSequence[i + 1], raffle: true },
          moveSequence[i].x,
          moveSequence[i].y
        );
      }

      const nextObligMoves = calculateTakeMoves(
        newBoard,
        piece,
        lastMove.x,
        lastMove.y
      );

      if (nextObligMoves.length > 0) {
        continueRaffle = true;
        nextMoveSequences = nextMoveSequences.concat(
          nextObligMoves.map((nextMove) => moveSequence.concat([nextMove]))
        );
      }
    }

    if (continueRaffle) {
      moveSequences = nextMoveSequences;
    }
  }

  return moveSequences;
}

function calculateMovablePieces(board: Board, player: Player) {
  let maxRaffleSize = 0;
  let takingPieces: { x: number; y: number; raffleSize: number }[] = [];
  let pieces = [];

  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const piece = board[y][x];
      if (piece != null && piece.player === player) {
        // Check if the piece can take another piece
        const takeMoves = calculateTakeMoves(board, piece, x, y);
        if (takeMoves.length > 0) {
          let raffleSizes = calculateMoveSequences(board, piece, x, y).map(
            (moveSequence) => moveSequence.length
          );
          let raffleSize = Math.max(...raffleSizes);
          if (raffleSize > maxRaffleSize) {
            maxRaffleSize = raffleSize;
            takingPieces = [{ x, y, raffleSize }];
          } else if (raffleSize === maxRaffleSize) {
            takingPieces.push({ x, y, raffleSize });
          }
        } else {
          // Check if the piece can move regularly
          const regularMoves = calculateRegularMoves(board, piece, x, y);
          if (regularMoves.length > 0) {
            pieces.push({ x, y });
          }
        }
      }
    }
  }

  return takingPieces.length > 0 ? takingPieces : pieces;
}

export function calculateBoardAfterMove(
  board: Board,
  move: MoveWithTakenAndRaffle,
  x: number,
  y: number
): Board {
  const newBoard = JSON.parse(JSON.stringify(board));
  newBoard[move.y][move.x] = board[y][x];
  newBoard[y][x] = null;

  if (move.taken != null) {
    newBoard[move.taken.y][move.taken.x] = null;
  }

  if (!move.raffle) {
    // Promote the piece to a king if it reaches the opposite side of the board
    if (move.y === 0) {
      newBoard[move.y][move.x].type = PieceType.King;
    }
  }

  return newBoard;
}

export function calculatePossibleMoves(
  board: Board,
  piece: Piece,
  x: number,
  y: number
): MoveWithTakenAndRaffle[] {
  // Check if the piece is movable (if other pieces can take, the piece must take to be movable)
  const movable = calculateMovablePieces(board, piece.player);
  if (movable.find((pos) => pos.x === x && pos.y === y) == null) {
    return [];
  }

  let moveSequences = calculateMoveSequences(board, piece, x, y);
  console.log(moveSequences);

  return moveSequences.map((moveSequence) => {
    return { ...moveSequence[0], raffle: moveSequence.length > 1 };
  });
}
