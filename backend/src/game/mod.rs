use serde::{Deserialize, Serialize};

pub mod checker;
pub mod chess;

#[derive(Serialize, Deserialize, Debug, Clone, Copy, PartialEq, Eq)]
pub enum Player {
    White,
    Black,
}

impl ToString for Player {
    fn to_string(&self) -> String {
        match self {
            Player::White => "W",
            Player::Black => "B",
        }
        .to_owned()
    }
}
