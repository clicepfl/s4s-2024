# Setup runtime image
FROM debian:bookworm AS runtime
RUN apt-get update && apt-get upgrade -y && apt-get install -y ca-certificates openssl

# Build on a dedicated image to avoid build output in final image
FROM rust:latest AS rust_build
# cargo-build-deps is a tool to only install and build dependencies
RUN cargo install cargo-build-deps
RUN cargo new app
WORKDIR /app
COPY Cargo.toml Cargo.lock ./
RUN cargo build-deps --release

# Add and build project
COPY src ./src
RUN cargo build --release

# Copies build result into runtime image
FROM runtime

WORKDIR /app

ENV DATA_DIR = /data
RUN mkdir /data

ENV ROCKET_ADDRESS=0.0.0.0

COPY --from=rust_build /app/target/release/backend ./backend

ENV RUST_LOG=info

CMD ["./backend"]