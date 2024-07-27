use serde::{Deserialize, Serialize};

use super::Player;

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub enum PieceType {
    Pawn,
    Rook,
    Queen,
    Knight,
    Bishop,
    King,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Piece {
    #[serde(rename = "type")]
    pub type_: PieceType,
    pub player: Player,
}

const BOARD_SIZE: usize = 8;

type Board = [[Option<Piece>; BOARD_SIZE]; BOARD_SIZE];

fn default_board() -> Board {
    use PieceType::*;
    use Player::*;

    let mut board: Board = Board::default();
    const ROW: [PieceType; 8] = [Rook, Knight, Bishop, Queen, King, Bishop, Knight, Rook];

    for i in 0..BOARD_SIZE {
        board[0][i] = Some(Piece {
            player: Black,
            type_: ROW[i],
        });
        board[1][i] = Some(Piece {
            player: Black,
            type_: Pawn,
        });

        board[BOARD_SIZE - 2][i] = Some(Piece {
            player: White,
            type_: Pawn,
        });
        board[BOARD_SIZE - 1][i] = Some(Piece {
            player: White,
            type_: ROW[BOARD_SIZE - 1 - i],
        });
    }

    board
}
