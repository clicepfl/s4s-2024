use std::{path::PathBuf, str::FromStr};

use rocket::{
    post,
    tokio::{fs::File, io::AsyncWriteExt},
};

use super::{AppState, Error};

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
    lang: Language,
    code: PathBuf,
}

impl Submission {
    fn start(&self) {
        todo!()
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

    state
        .lock()
        .unwrap()
        .submissions
        .insert(email, Submission { lang, code: path });

    Ok(())
}
