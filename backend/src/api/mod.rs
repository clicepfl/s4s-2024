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

const SESSION_COOKIE: &str = "SESSION";

#[derive(Default, Debug)]
pub struct State {
    pub submissions: HashMap<String, Submission>,
    pub games: HashMap<String, Arc<rocket::tokio::sync::Mutex<Game>>>,
}

pub type AppState = rocket::State<std::sync::Mutex<State>>;

pub fn routes() -> Vec<Route> {
    routes![submissions::post_submission, play::start]
}

#[derive(Debug)]
pub enum Error {
    IO(std::io::Error),
    InvalidLanguage,
    NotFound,
    InvalidMove,
    AIFailed,
    Unauthorized,
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
            Error::Unauthorized => Status::Unauthorized,
        })
    }
}

impl From<std::io::Error> for Error {
    fn from(value: std::io::Error) -> Self {
        Self::IO(value)
    }
}

pub struct User {
    pub name: String,
}

#[rocket::async_trait]
impl<'r> FromRequest<'r> for User {
    type Error = self::Error;

    async fn from_request(req: &'r Request<'_>) -> request::Outcome<Self, Self::Error> {
        if let Some(name) = req.cookies().get(SESSION_COOKIE) {
            request::Outcome::Success(User {
                name: name.value().to_owned(),
            })
        } else {
            request::Outcome::Error((rocket::http::Status::Unauthorized, Error::Unauthorized))
        }
    }
}
