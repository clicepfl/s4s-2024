use envconfig::Envconfig;
use std::sync::OnceLock;

#[derive(Envconfig)]
pub struct Config {
    #[envconfig(from = "DATA_DIR")]
    pub data_dir: String,
}

static CONFIG: OnceLock<Config> = OnceLock::new();
pub fn config() -> &'static Config {
    CONFIG.get_or_init(|| Config::init_from_env().unwrap())
}
