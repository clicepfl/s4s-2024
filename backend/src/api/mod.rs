use std::collections::HashMap;

use rocket::{response::Responder, routes, Route};
use submissions::Submission;
use uuid::Uuid;

pub mod contest;
pub mod play;
pub mod submissions;

type Game = ();

#[derive(Default, Debug)]
pub struct State {
    pub submissions: HashMap<String, Submission>,
    pub games: HashMap<Uuid, Game>,
}

pub type AppState = rocket::State<std::sync::Mutex<State>>;

pub fn routes() -> Vec<Route> {
    routes![submissions::post_submission]
}

pub enum Error {
    IO(std::io::Error),
    InvalidLanguage,
}

impl<'r, 'o: 'r> Responder<'r, 'o> for Error {
    fn respond_to(self, _: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        use rocket::http::Status;

        Err(match self {
            Error::IO(_) => Status::InternalServerError,
            Error::InvalidLanguage => Status::BadRequest,
        })
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Self::IO(value)
    }
}
