# CLIC x S4S - 2024

## Dev

### Dependencies

You will need the following dependencies:

- [Rust](rustup.rs)
- [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [docker](https://www.docker.com/get-started/)

## Set up environment files

In `app/.env`, put:

```sh
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000/s4s
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Run locally

From the `app` directory, run `npm i &&NEXT_PUBLIC_API_URL=http://localhost:8000 npm run dev` in your terminal. In parallel, run `mkdir -p data &&DATA_DIR=$PWD/data cargo r` from the `backend` directory.

Now, you can access the website on <http://localhost:3000/s4s>.
