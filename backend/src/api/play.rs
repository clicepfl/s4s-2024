use std::sync::Arc;

use super::{AppState, Error, User};
use crate::game::{GameState, Player};
use async_process::{Child, ChildStdin, ChildStdout};
use rocket::{
    futures::{io::BufReader, AsyncBufReadExt, AsyncWriteExt},
    post,
    serde::json::Json,
    tokio::sync::Mutex,
};
use serde::Deserialize;

#[derive(Debug)]
pub struct Game {
    handle: Child,
    stdin: ChildStdin,
    stdout: BufReader<ChildStdout>,
    checkers: GameState,
    human_player: Player,
}

fn convert_cell_id(id: &[char]) -> (usize, usize) {
    (id[0] as usize - 'A' as usize, id[0] as usize - '0' as usize)
}

impl Game {
    pub async fn play_ai(&mut self) -> Result<(), Error> {
        self.stdin
            .write_all(self.checkers.to_csv_string().as_bytes())
            .await
            .map_err(Error::from)?;

        let mut line = String::new();
        self.stdout.read_line(&mut line).await?;

        for m in line.split(";") {
            let char = m.chars().collect::<Vec<_>>();

            self.checkers
                .apply_move(convert_cell_id(&char[0..=1]), convert_cell_id(&char[2..=3]))?;
        }

        Ok(())
    }

    pub async fn play_human(&mut self, moves: Vec<Move>) -> Result<(), Error> {
        for move_ in moves {
            self.checkers.apply_move(move_.from, move_.to)?;
        }

        Ok(())
    }
}

#[post("/game/start/<is_first_player>")]
pub async fn start(
    state: &AppState,
    user: User,
    is_first_player: bool,
) -> Result<Json<GameState>, Error> {
    let mut lock = state.lock().unwrap();

    let mut child = lock
        .submissions
        .get(&user.name)
        .ok_or(Error::NotFound)?
        .start()?;
    let checkers: GameState = Default::default();

    lock.games.insert(
        user.name,
        Arc::new(Mutex::new(Game {
            stdin: child.stdin.take().unwrap(),
            stdout: BufReader::new(child.stdout.take().unwrap()),
            handle: child,
            human_player: if is_first_player {
                Player::White
            } else {
                Player::Black
            },
            checkers: checkers.clone(),
        })),
    );

    Ok(Json(checkers))
}

#[derive(Deserialize, Debug)]
pub struct Move {
    pub from: (usize, usize),
    pub to: (usize, usize),
}

#[post("/game", format = "json", data = "<moves>")]
pub async fn play(
    state: &AppState,
    user: User,
    moves: Json<Vec<Move>>,
) -> Result<Json<GameState>, Error> {
    let game = state.lock().unwrap().games.get(&user.name).map(Arc::clone);

    if game.is_none() {
        return Err(Error::NotFound);
    }

    let game = game.unwrap();
    let mut lock = game.lock().await;

    lock.play_human(moves.into_inner()).await?;
    lock.play_ai().await?;

    Ok(Json(lock.checkers.clone()))
}

#[post("/game/stop")]
pub async fn stop(state: &AppState, user: User) -> Result<(), Error> {
    let game = state.lock().unwrap().games.remove(&user.name);

    if game.is_none() {
        return Err(Error::NotFound);
    }

    let game = game.unwrap();
    game.lock().await.handle.kill()?;

    Ok(())
}
