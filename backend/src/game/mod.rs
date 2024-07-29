use serde::{Deserialize, Serialize};
use std::fmt::{Display, Write};

pub mod checker;
pub mod chess;

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
