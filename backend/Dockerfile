# Setup runtime image
FROM docker:latest AS runtime

RUN apk update --no-cache
RUN apk upgrade --no-cache
RUN apk add ca-certificates openssl

# Build on a dedicated image to avoid build output in final image
FROM rust:alpine AS rust_build

RUN apk add musl-dev

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