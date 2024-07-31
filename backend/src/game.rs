use std::fmt::{Display, Write};

use serde::{Deserialize, Serialize};

use crate::api::Error;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum Player {
    White,
    Black,
}

impl Display for Player {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_char(match self {
            Player::White => 'W',
            Player::Black => 'B',
        })
    }
}

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub enum PieceType {
    Man,
    King,
}

impl Display for PieceType {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.write_char(match self {
            PieceType::Man => 'M',
            PieceType::King => 'K',
        })
    }
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Piece {
    #[serde(rename = "type")]
    pub type_: PieceType,
    pub player: Player,
}

impl Display for Piece {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}{}", self.type_, self.player)
    }
}

const BOARD_SIZE: usize = 8;

pub type Board = [[Option<Piece>; BOARD_SIZE]; BOARD_SIZE];

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

#[derive(Debug, Serialize, Clone)]
pub struct GameState {
    pub board: Board,
    pub current_player: Player,
}

impl Default for GameState {
    fn default() -> Self {
        Self {
            board: default_board(),
            current_player: Player::White,
        }
    }
}

impl GameState {
    pub fn to_csv_string(&self) -> String {
        self.board
            .iter()
            .map(|row| {
                row.iter()
                    .map(|piece| {
                        piece
                            .as_ref()
                            .map_or_else(|| "".to_owned(), Piece::to_string)
                    })
                    .collect::<Vec<_>>()
                    .join(";")
            })
            .collect::<Vec<_>>()
            .join("\n")
    }

    pub fn apply_move(&mut self, from: (usize, usize), to: (usize, usize)) -> Result<(), Error> {
        self.board[to.0][to.1] = self.board[from.0][from.1].take();
        Ok(())
    }
}
