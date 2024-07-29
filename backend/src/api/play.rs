use std::sync::Arc;

use super::{AppState, Error};
use crate::game::{checker::CheckersGame, Player};
use async_process::{Child, ChildStdin, ChildStdout};
use rocket::{
    futures::{io::BufReader, AsyncBufReadExt, AsyncWriteExt},
    post,
    serde::json::Json,
    tokio::sync::Mutex,
};
use serde::Deserialize;
use uuid::Uuid;

#[derive(Debug)]
pub struct Game {
    handle: Child,
    stdin: ChildStdin,
    stdout: BufReader<ChildStdout>,
    checkers: CheckersGame,
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

#[post("/game/start/<name>?<start>")]
pub async fn start(state: &AppState, name: &str, start: bool) -> Result<Json<CheckersGame>, Error> {
    let mut lock = state.lock().unwrap();

    let mut child = lock.submissions.get(name).ok_or(Error::NotFound)?.start()?;
    let checkers: CheckersGame = Default::default();

    lock.games.insert(
        Uuid::new_v4(),
        Arc::new(Mutex::new(Game {
            stdin: child.stdin.take().unwrap(),
            stdout: BufReader::new(child.stdout.take().unwrap()),
            handle: child,
            human_player: if start { Player::White } else { Player::Black },
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

#[post("/game/<uid>", format = "json", data = "<moves>")]
pub async fn play(
    state: &AppState,
    uid: Uuid,
    moves: Json<Vec<Move>>,
) -> Result<Json<CheckersGame>, Error> {
    let game = state.lock().unwrap().games.get(&uid).map(Arc::clone);

    if game.is_none() {
        return Err(Error::NotFound);
    }

    let game = game.unwrap();
    let mut lock = game.lock().await;

    lock.play_human(moves.into_inner()).await?;
    lock.play_ai().await?;

    Ok(Json(lock.checkers.clone()))
}

#[post("/game/<uid>/stop")]
pub async fn stop(state: &AppState, uid: Uuid) -> Result<(), Error> {
    let game = state.lock().unwrap().games.remove(&uid);

    if game.is_none() {
        return Err(Error::NotFound);
    }

    let game = game.unwrap();
    game.lock().await.handle.kill()?;

    Ok(())
}
