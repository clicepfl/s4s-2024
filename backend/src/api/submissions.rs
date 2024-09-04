use crate::config::config;

use super::{AppState, Error, User};
use async_process::{Child, Command};
use base64::{prelude::BASE64_STANDARD, Engine};
use rocket::{
    get, post,
    serde::json::Json,
    tokio::{
        fs::{self, File},
        io::{AsyncReadExt, AsyncWriteExt},
    },
};
use serde::{Deserialize, Serialize};
use std::{path::PathBuf, process::Stdio, str::FromStr};

#[derive(Serialize, Deserialize, Debug, Clone, Copy)]
#[serde(rename_all = "lowercase")]
enum Language {
    Cpp,
    Java,
    Python,
}

impl FromStr for Language {
    type Err = Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "cpp" => Ok(Self::Cpp),
            "java" => Ok(Self::Java),
            "python" => Ok(Self::Python),
            _ => Err(Error::InvalidLanguage),
        }
    }
}

#[derive(Clone, Debug)]
pub struct Submission {
    name: String,
    lang: Language,
    code: PathBuf,
}

impl Submission {
    pub fn empty(name: String) -> Result<Self, Error> {
        let path = PathBuf::from_str(format!("{}/{}", config().data_dir, name).as_str()).unwrap();

        std::fs::File::create(path.clone())?;

        Ok(Self {
            name,
            lang: Language::Cpp,
            code: path,
        })
    }

    pub async fn start(&self) -> Result<Child, Error> {
        let metadata = fs::metadata(self.code.clone()).await;
        if metadata.is_err() || metadata.is_ok_and(|m| m.len() == 0) {
            return Err(Error::AIFailed {
                error: super::AIError::EmptySubmission,
                ai_output: "".to_owned(),
                move_: None,
            });
        }

        let base_code = {
            let mut code = String::new();
            File::open(self.code.clone())
                .await?
                .read_to_string(&mut code)
                .await?;

            BASE64_STANDARD.encode(code.as_bytes())
        };

        let (image, command) = match self.lang {
            Language::Cpp => (
                "ghcr.io/clicepfl/s4s-2024-cpp:main",
                format!("echo {base_code} | base64 -d > /script.cpp && g++ /script.cpp -o /exe && /exe"),
            ),
            Language::Java => ("cimg/openjdk:17.0", format!("echo {base_code} | base64 -d > /script.java && java /script.java")),
            Language::Python => ("python:3-bullseye", format!("echo {base_code} | base64 -d > /script.py && python /script.py")),
        };

        Command::new("docker")
            .args([
                "run",
                "-u",
                "root",
                "-i",
                image,
                "sh",
                "-c",
                command.as_str(),
            ])
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()
            .map_err(Error::from)
    }
}

#[derive(Serialize, Debug)]
pub struct SubmissionStatus {
    code: String,
    lang: Language,
}

#[get("/submission")]
pub async fn get_submission(user: User, state: &AppState) -> Result<Json<SubmissionStatus>, Error> {
    let submission = {
        let lock = state.lock()?;
        lock.submissions
            .get(&user.name)
            .ok_or(Error::NotFound)?
            .clone()
    };

    let mut code = String::new();
    File::open(submission.code)
        .await?
        .read_to_string(&mut code)
        .await?;

    Ok(Json(SubmissionStatus {
        code,
        lang: submission.lang,
    }))
}

#[post("/submission?<lang>", data = "<code>")]
pub async fn post_submission(
    user: User,
    lang: String,
    code: &[u8],
    state: &AppState,
) -> Result<(), Error> {
    let lang = Language::from_str(lang.as_str())?;

    let path = PathBuf::from_str(format!("{}/{}", config().data_dir, user.name).as_str()).unwrap();

    File::create(path.clone())
        .await
        .inspect_err(|e| println!("{e:#?}"))?
        .write_all(code)
        .await
        .inspect_err(|e| println!("{e:#?}"))?;

    state.lock().unwrap().submissions.insert(
        user.name.clone(),
        Submission {
            name: user.name,
            lang,
            code: path,
        },
    );

    Ok(())
}
