use play::Game;
use rocket::{response::Responder, routes, Route};
use std::{collections::HashMap, sync::Arc};
use submissions::Submission;
use uuid::Uuid;

pub mod contest;
pub mod play;
pub mod submissions;

#[derive(Default, Debug)]
pub struct State {
    pub submissions: HashMap<String, Submission>,
    pub games: HashMap<Uuid, Arc<rocket::tokio::sync::Mutex<Game>>>,
}

pub type AppState = rocket::State<std::sync::Mutex<State>>;

pub fn routes() -> Vec<Route> {
    routes![submissions::post_submission, play::start]
}

pub enum Error {
    IO(std::io::Error),
    InvalidLanguage,
    NotFound,
    InvalidMove,
    AIFailed,
}

impl<'r, 'o: 'r> Responder<'r, 'o> for Error {
    fn respond_to(self, _: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        use rocket::http::Status;

        Err(match self {
            Error::IO(_) => Status::InternalServerError,
            Error::InvalidLanguage => Status::BadRequest,
            Error::NotFound => Status::NotFound,
            Error::InvalidMove => Status::BadRequest,
            Error::AIFailed => Status::NotAcceptable,
        })
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Self::IO(value)
    }
}
