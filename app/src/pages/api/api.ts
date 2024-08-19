import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import { API_URL, SESSION_COOKIE_NAME } from "./config";
import { GameState } from "./models";

type MoveSequence = { from: [number, number]; to: [number, number] }[];
type SubmissionLanguage = "python" | "java" | "cpp";

async function apiCall(
  uri: string,
  { body, token, method }: { body?: any; token?: string; method?: string }
) {
  let headers = {};
  if (body !== undefined) {
    headers = { ...headers, "Content-Type": "application/json" };
  }
  if (token !== undefined) {
    headers = { ...headers, Authorization: `Bearer ${token}` };
  }

  return await fetch(`${API_URL}/${uri}`, {
    method: method || "GET",
    body: body ? JSON.stringify(body) : undefined,
    headers,
  });
}

export async function createGame(
  isFirstPlayer: boolean
): Promise<GameState | Error> {
  return await (
    await apiCall(`game/start?is_first_player=${isFirstPlayer}`, {
      method: "POST",
    })
  ).json();
}

export async function getGameState(): Promise<GameState | Error> {
  return await (await apiCall("game", { method: "GET" })).json();
}

export async function makeMove(
  moves: MoveSequence
): Promise<GameState | Error> {
  return await (await apiCall("game", { body: moves, method: "POST" })).json();
}

export async function stopGame(): Promise<void> {
  await apiCall("game/stop", { method: "POST" });
}

export async function submitCode(
  language: SubmissionLanguage,
  code: string
): Promise<void> {
  await apiCall(`submission?lang=${language}`, { body: code, method: "POST" });
}
