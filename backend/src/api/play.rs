use super::{AppState, Error, User};
use crate::game::{GameState, Move, Player, TurnStatus};
use async_process::{Child, ChildStderr, ChildStdin, ChildStdout};
use rocket::{
    futures::{io::BufReader, AsyncBufReadExt, AsyncWriteExt},
    get, post,
    serde::json::Json,
    tokio::sync::Mutex,
};
use std::sync::Arc;

#[derive(Debug)]
pub struct Game {
    handle: Child,
    stdin: ChildStdin,
    stdout: BufReader<ChildStdout>,
    stderr: BufReader<ChildStderr>,
    checkers: GameState,
    human_player: Player,
}

fn convert_cell_id(id: &[char]) -> (usize, usize) {
    (id[0] as usize - 'A' as usize, id[0] as usize - '0' as usize)
}

impl Game {
    pub async fn play_ai(&mut self) -> Result<String, Error> {
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

        let mut res = vec![];
        self.stderr.read_until(1, &mut res);
        Ok(String::from_utf8_lossy(&res).to_string())
    }

    pub async fn play_human(&mut self, moves: Vec<Move>) -> Result<(), Error> {
        for move_ in moves {
            self.checkers.apply_move(move_.from, move_.to)?;
        }

        Ok(())
    }
}

#[get("/game")]
pub async fn get_game(state: &AppState, user: User) -> Result<Json<GameState>, Error> {
    let game = {
        let mutex = {
            let lock = state.lock()?;
            lock.games.get(&user.name).ok_or(Error::NotFound)?.clone()
        };

        let lock = mutex.lock().await;
        lock.checkers.clone()
    };

    Ok(Json(game))
}

#[post("/game/start?<is_first_player>")]
pub async fn start(
    state: &AppState,
    user: User,
    is_first_player: bool,
) -> Result<Json<TurnStatus>, Error> {
    let game = {
        let lock = state.lock().unwrap();
        lock.games.get(&user.name).cloned()
    };

    if let Some(game) = game {
        if game.lock().await.handle.try_status()?.is_none() {
            return Err(Error::GameAlreadyInProgress);
        }
    }

    let mut child = {
        let lock = state.lock().unwrap();
        lock.submissions
            .get(&user.name)
            .ok_or(Error::NotFound)?
            .start()?
    };

    let checkers: GameState = Default::default();

    let mut stderr = BufReader::new(child.stderr.take().unwrap());

    let mut output = vec![];
    stderr.read_until(1, &mut output).await?;

    let mut lock = state.lock().unwrap();
    lock.games.insert(
        user.name,
        Arc::new(Mutex::new(Game {
            stdin: child.stdin.take().unwrap(),
            stdout: BufReader::new(child.stdout.take().unwrap()),
            stderr,
            handle: child,
            human_player: if is_first_player {
                Player::White
            } else {
                Player::Black
            },
            checkers: checkers.clone(),
        })),
    );

    Ok(Json(TurnStatus {
        game: checkers,
        ai_output: String::from_utf8_lossy(&output).to_string(),
    }))
}

#[post("/game", format = "json", data = "<moves>")]
pub async fn play(
    state: &AppState,
    user: User,
    moves: Json<Vec<Move>>,
) -> Result<Json<TurnStatus>, Error> {
    let game = state.lock().unwrap().games.get(&user.name).map(Arc::clone);

    if game.is_none() {
        return Err(Error::NotFound);
    }

    let game = game.unwrap();
    let mut lock = game.lock().await;

    lock.play_human(moves.into_inner()).await?;
    let output = lock.play_ai().await?;

    Ok(Json(TurnStatus {
        game: lock.checkers.clone(),
        ai_output: output,
    }))
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
