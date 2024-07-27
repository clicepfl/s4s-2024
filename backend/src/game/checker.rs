use serde::{Deserialize, Serialize};

use super::Player;

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub enum PieceType {
    Man,
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
    fn fill_row(board: &mut Board, row: usize, player: Player) {
        for i in 0..BOARD_SIZE {
            if (i + row) % 2 == 0 {
                board[row][i] = Some(Piece {
                    type_: PieceType::Man,
                    player,
                })
            }
        }
    }

    let mut board: Board = Board::default();

    fill_row(&mut board, 0, Player::Black);
    fill_row(&mut board, 1, Player::Black);
    fill_row(&mut board, 2, Player::Black);

    fill_row(&mut board, BOARD_SIZE - 3, Player::White);
    fill_row(&mut board, BOARD_SIZE - 2, Player::White);
    fill_row(&mut board, BOARD_SIZE - 1, Player::White);

    board
}
