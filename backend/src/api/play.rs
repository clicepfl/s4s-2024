use rocket::post;
use uuid::Uuid;

use super::{AppState, Error};
use std::process::Child;

#[derive(Debug)]
pub struct Game {
    handle: Child,
}

#[post("/start/<name>")]
pub async fn start(state: &AppState, name: &str) -> Result<(), Error> {
    let mut lock = state.lock().unwrap();

    let child = lock.submissions.get(name).ok_or(Error::NotFound)?.start()?;

    lock.games.insert(Uuid::new_v4(), Game { handle: child });

    Ok(())
}
