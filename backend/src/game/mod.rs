use serde::{Deserialize, Serialize};

pub mod checker;
pub mod chess;

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
pub enum Player {
    White,
    Black,
}
