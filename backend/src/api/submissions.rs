use super::{AppState, Error};
use async_process::{Child, Command};
use rocket::{
    post,
    tokio::{fs::File, io::AsyncWriteExt},
};
use std::{path::PathBuf, process::Stdio, str::FromStr};

#[derive(Debug)]
enum Language {
    CPP,
    Java,
    Python,
}

impl FromStr for Language {
    type Err = Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        match s {
            "cpp" => Ok(Self::CPP),
            "java" => Ok(Self::Java),
            "python" => Ok(Self::Python),
            _ => Err(Error::InvalidLanguage),
        }
    }
}

#[derive(Debug)]
pub struct Submission {
    name: String,
    lang: Language,
    code: PathBuf,
}

impl Submission {
    pub fn start(&self) -> Result<Child, Error> {
        match self.lang {
            Language::Python => Command::new("docker")
                .args([
                    "run",
                    "-v",
                    format!("{}:/script.py", self.code.to_string_lossy()).as_str(),
                    "-i",
                    "python:3-bullseye",
                    "python",
                    "/script.py",
                ])
                .stdin(Stdio::piped())
                .stdout(Stdio::piped())
                .spawn()
                .map_err(Error::from),
            _ => todo!(),
        }
    }
}

#[post("/submissions?<email>&<lang>", data = "<code>")]
pub async fn post_submission(
    email: String,
    lang: String,
    code: &[u8],
    state: &AppState,
) -> Result<(), Error> {
    let lang = Language::from_str(lang.as_str())?;

    let path = PathBuf::from_str(format!("/data/{email}").as_str()).unwrap();

    File::create(path.clone())
        .await
        .inspect_err(|e| println!("{e:#?}"))?
        .write_all(code)
        .await
        .inspect_err(|e| println!("{e:#?}"))?;

    state.lock().unwrap().submissions.insert(
        email.clone(),
        Submission {
            name: email,
            lang,
            code: path,
        },
    );

    Ok(())
}
