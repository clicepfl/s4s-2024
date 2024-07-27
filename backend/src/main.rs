use api::State;
use rocket::{launch, tokio::sync::Mutex};

pub mod api;
pub mod game;

#[launch]
fn rocket() -> _ {
    rocket::build()
        .manage(Mutex::<State>::default())
        .mount("/", api::routes())
}
