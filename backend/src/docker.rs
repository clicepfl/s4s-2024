use std::process::Command;

pub const JAVA_IMAGE: &str = "cimg/openjdk:17.0";
pub const PYTHON_IMAGE: &str = "python:3-bullseye";
pub const CPP_IMAGE: &str = "ghcr.io/clicepfl/s4s-2024-cpp:main";

pub const IMAGES: [&str; 3] = [JAVA_IMAGE, PYTHON_IMAGE, CPP_IMAGE];

pub fn pull_required_images() {
    for image in IMAGES {
        if let Err(err) = Command::new("docker").args(["pull", image]).status() {
            println!("Error while pulling {image}: {err:#?}");
        }
    }
}
