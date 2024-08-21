use play::Game;
use rocket::{
    request::{self, FromRequest},
    response::Responder,
    routes, Request, Route,
};
use std::{collections::HashMap, sync::Arc};
use submissions::Submission;

pub mod contest;
pub mod play;
pub mod submissions;

#[derive(Default, Debug)]
pub struct State {
    pub submissions: HashMap<String, Submission>,
    pub games: HashMap<String, Arc<rocket::tokio::sync::Mutex<Game>>>,
}

pub type AppState = rocket::State<std::sync::Mutex<State>>;

pub fn routes() -> Vec<Route> {
    routes![
        submissions::get_submission,
        submissions::post_submission,
        play::get_game,
        play::start,
        play::stop,
        play::play,
    ]
}

#[derive(Debug)]
pub enum Error {
    IO,
    Poison,
    InvalidLanguage,
    NotFound,
    InvalidMove,
    AIFailed,
    Unauthorized,
    GameAlreadyInProgress,
}

impl<'r, 'o: 'r> Responder<'r, 'o> for Error {
    fn respond_to(self, _: &'r rocket::Request<'_>) -> rocket::response::Result<'o> {
        use rocket::http::Status;

        Err(match self {
            Error::IO | Error::Poison => Status::InternalServerError,
            Error::NotFound => Status::NotFound,
            Error::InvalidMove | Error::GameAlreadyInProgress | Error::InvalidLanguage => {
                Status::BadRequest
            }
            Error::AIFailed => Status::NotAcceptable,
            Error::Unauthorized => Status::Unauthorized,
        })
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        dbg!(value);
        Self::IO
    }
}

impl<Guard> From<std::sync::PoisonError<Guard>> for Error {
    fn from(value: std::sync::PoisonError<Guard>) -> Self {
        dbg!(value);
        Self::Poison
    }
}

pub struct User {
    pub name: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for User {
    type Error = self::Error;

    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        if let Some(name) = req
            .headers()
            .get_one("Authorization")
            .and_then(|header| header.strip_prefix("Bearer "))
        {
            request::Outcome::Success(User {
                name: name.to_owned(),
            })
        } else {
            request::Outcome::Error((rocket::http::Status::Unauthorized, Error::Unauthorized))
        }
    }
}
