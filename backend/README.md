# API

The name of the user must be saved in the `SESSION` cookie as plain text, and passed to each request.

## Endpoints

### POST `/game/start?<is_first_player>`

Creates a game against the user's submission.

#### Query parameters

- `is_first_player (bool)`: Whether the user is the first player.

#### Response Body

The initial `GameState`.

---

### GET `/game`

Get the current state of the game.

### Response

The current `GameState`.

---

### POST `/game`

Plays a sequence of moves. The moves must match the game's rules. Must be used when it is the user's turn.

### Request Body

```ts
type Body = { from: [number, number]; to: [number, number] }[];
```

### Response

The `GameState` after the AI has played.

---

### POST `/game/stop`

Stops the current game.

---

### POST `/submission?<lang>`

Updates the user's submissions.

### Query Parameters

- `lang (string)`: The language used for the submissions. Must be one of `"cpp" | "java" | "python"`

### Request Body

The code as plain text.

## Models

```ts
interface GameState {
  board: Board;
  current_player: Player;
}

type Board = (Piece | null)[][];

interface Piece {
  type: PieceType;
  player: Player;
}

enum Player {
  White = "white",
  Black = "black",
}

enum PieceType {
  Man = "man",
  King = "king",
}
```
