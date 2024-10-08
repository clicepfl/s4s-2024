# API

The name of the user must be given for each request in the `Authorization` header as follow:

```
Authorization: Bearer <name>
```

## Endpoints

### POST `/login?<name>`

Logs in using the provided. Either returns a 200 (OK) or 409 (Conflict) HTTP code.

### POST `/game/start?<is_first_player>`

Creates a game against the user's submission. Fails if the user already has a game in progress.

#### Query parameters

- `is_first_player (bool)`: Whether the user is the first player.

#### Response

The initial `TurnStatus`.

---

### GET `/game`

Get the current state of the game.

### Response

The current `TurnStatus`.

---

### POST `/game`

Plays a sequence of moves. The moves must match the game's rules. Must be used when it is the user's turn.

### Request Body

A `Move[]`.

### Response

The `TurnStatus` after the AI has played.

---

### POST `/game/stop`

Stops the current game.

---

### GET `/submission`

Retrieves the user's submission.

### Response

```ts
type Body = { lang: 'cpp' | 'java' | 'python'; code: string };
```

---

### POST `/submission?<lang>`

Updates the user's submissions.

### Query Parameters

- `lang (string)`: The language used for the submissions. Must be one of `"cpp" | "java" | "python"`

### Request Body

The code as plain text.

## Errors

Errors are returned as status code. Most notable ones are:

- `401 Unauthorized`: Missing session cookie.
- `406 Not acceptable`: The AI has failed to provide a valid move. The response will contain a JSON with the `AIError` format.

## Models

```ts
interface GameState {
  board: Board;
  current_player: Player;
  status: GameStatus;
}

type GameStatus =
  | {
      status: 'draw' | 'running';
    }
  | { status: 'victory'; player: Player };

interface TurnStatus {
  game: GameState;
  ai_output: string; // Everything printed by the AI on stderr since the start/last move.
}

type Board = (Piece | null)[][];

interface Piece {
  type: PieceType;
  player: Player;
}

enum Player {
  White = 'white',
  Black = 'black',
}

enum PieceType {
  Man = 'man',
  King = 'king',
}

enum AIErrorType {
  NoSubmission = 'noSubmission',
  InvalidMove = 'invalidMove',
  InvalidOutput = 'invalidOutput',
}

interface AIError {
  error: AIErrorType,
  ai_output: string,
  move: Move[] | null
}

interface Move { 
  from: [number, number]; 
  to: [number, number] 
};
```
