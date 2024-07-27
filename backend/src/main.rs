use rocket::launch;

pub mod game;
pub mod api;

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", api::routes())
}
