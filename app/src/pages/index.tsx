import Head from "next/head";
import { Inter } from "next/font/google";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import Board from "@/components/Board";
import {
  Board as BoardState,
  emptyBoard,
  Player,
  SubmissionLanguage,
} from "./api/models";
import {
  createGame,
  loadSubmission,
  requireSession,
  stopGame,
  submitCode,
} from "./api/api";
import SwapIcon from "@/components/icons/SwapIcon";

const inter = Inter({ subsets: ["latin"] });

const initFiles: {
  [lang: string]: { name: string; value: string };
} = {
  [SubmissionLanguage.Java]: {
    name: "Java",
    value: "// Java",
  },
  [SubmissionLanguage.Cpp]: {
    name: "C++",
    value: "// C++",
  },
  [SubmissionLanguage.Python]: {
    name: "Python",
    value: "# Python",
  },
};

export default function Home({ username }: { username: string }) {
  const [selectedLang, setLang] = useState(SubmissionLanguage.Java);
  const [file, setFile] = useState(initFiles[selectedLang].value);
  const [gameOngoing, setGameOngoing] = useState(false);
  const [player, setPlayer] = useState(Player.White);
  const [currentTurn, setCurrentTurn] = useState<Player | null>(null);

  function changeLang(lang: SubmissionLanguage) {
    if (initFiles[selectedLang].value === file) {
      // If the current file is the default one, we can safely change the language
      setLang(lang);
      setFile(initFiles[lang].value);
    } else {
      // Otherwise, we ask for confirmation
      if (
        confirm(
          "Are you sure ? Changing the language will overwrite your current code."
        )
      ) {
        setLang(lang);
        setFile(initFiles[lang].value);
      }
    }
  }

  return (
    <>
      <Head>
        <title>CLIC Workshop</title>
        <meta name="description" content="Checkers Algo Workshop for S4S" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
        <div className="topbar">
          <img className="logo" src="clic.svg" />
          <h1>Workshop Jeu de Dames</h1>
          <div className="toolbar">
            <button
              className="button"
              disabled={gameOngoing}
              onClick={() =>
                setPlayer(player === Player.White ? Player.Black : Player.White)
              }
            >
              <SwapIcon />
            </button>
            <button
              className="button"
              onClick={() => {
                if (gameOngoing) {
                  stopGame(username);
                  setGameOngoing(false);
                } else {
                  createGame(username, player == Player.Black).then(
                    (game) => {
                      if (game instanceof Error) {
                        alert(game.message);
                      } else {
                        setGameOngoing(true);
                      }
                    },
                    (err) => alert(err.message)
                  );
                }
              }}
            >
              {gameOngoing ? "Stop Game" : "Start Game"}
            </button>
            <button
              className="button"
              onClick={() =>
                submitCode(selectedLang, file, username).then(
                  () => alert("Code submitted !"),
                  (err) => alert(err.message)
                )
              }
            >
              Submit
            </button>

            <button
              className="button"
              onClick={() => {
                if (
                  confirm(
                    "Are you sure ? Loading your last submission will overwrite your current code."
                  )
                ) {
                  loadSubmission(username).then(
                    ({ lang, code }) => {
                      setLang(lang);
                      setFile(code);
                    },
                    (err) => alert(err.message)
                  );
                }
              }}
            >
              Load
            </button>

            <select
              className="lang-select"
              value={selectedLang}
              onChange={(e) => changeLang(e.target.value as SubmissionLanguage)}
            >
              {Object.values(SubmissionLanguage).map((lang) => (
                <option key={lang} value={lang}>
                  {initFiles[lang].name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="main-content">
          <div className="side-panel">
            <div className="instructions">
              <p>Welcome {username} !</p>
            </div>
            <div className="game">
              <div className="simulation">
                <Board
                  username={username}
                  player={player}
                  gameOngoing={gameOngoing}
                  currentTurn={currentTurn}
                  setCurrentTurn={setCurrentTurn}
                />
              </div>
              <div className="game-info">
                <p>Game State: {gameOngoing ? "Ongoing" : "Stopped"}</p>
                <p>Current Turn: {currentTurn ?? "None"}</p>
              </div>
            </div>
          </div>
          <div className="editor">
            <Editor
              theme="vs-dark"
              loading="Loading Editor..."
              language={selectedLang}
              value={file}
              onChange={(code) => (code ? setFile(code) : null)}
            />
          </div>
        </div>
      </main>
    </>
  );
}

export const getServerSideProps = requireSession(async (context, session) => {
  return { props: { username: session } };
});
