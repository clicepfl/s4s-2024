import Head from "next/head";
import { Inter } from "next/font/google";
import Editor from "@monaco-editor/react";
import { useEffect, useState } from "react";
import Board from "@/components/Board";
import {
  AIError,
  AIErrorType,
  Board as BoardState,
  emptyBoard,
  initialBoards,
  Player,
  SubmissionLanguage,
  TurnStatus,
} from "../api/models";
import {
  createGame,
  loadSubmission,
  requireSession,
  stopGame,
  submitCode,
} from "../api/api";
import SwapIcon from "@/components/icons/SwapIcon";
import { getInitialCode, initFiles } from "@/util/initCodeFiles";
import { rotateBoard } from "@/util/checkersCalculator";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ username }: { username: string }) {
  const [selectedLang, setLang] = useState(SubmissionLanguage.Java);
  const [file, setFile] = useState("");
  const [gameOngoing, setGameOngoing] = useState(false);
  const [player, setPlayer] = useState(Player.White);
  const [currentTurn, setCurrentTurn] = useState<Player | null>(null);
  const [board, setBoard] = useState(initialBoards[player]);

  enum ConsoleMessageType {
    Error = "error",
    Info = "info",
    Warning = "warning",
    Success = "success",
  }
  type ConsoleMessage = { msg: string; msgType: ConsoleMessageType };
  const [consoleOutput, setConsoleOutput] = useState<ConsoleMessage[]>([]);

  useEffect(() => {
    getInitialCode(SubmissionLanguage.Java).then((code) => setFile(code));
  }, []);

  async function changeLang(lang: SubmissionLanguage) {
    const currentInitialCode = await getInitialCode(selectedLang);
    const wantedInitialCode = await getInitialCode(lang);

    if (currentInitialCode === file) {
      // If the current file is the default one, we can safely change the language
      setLang(lang);
      setFile(wantedInitialCode);
    } else {
      // Otherwise, we ask for confirmation
      if (
        confirm(
          "Are you sure ? Changing the language will overwrite your current code."
        )
      ) {
        setLang(lang);
        setFile(wantedInitialCode);
      }
    }
  }

  function updateGame(turnStatus: TurnStatus | AIError) {
    if ("error" in turnStatus) {
      switch (turnStatus.error) {
        case AIErrorType.NoSubmission:
          setConsoleOutput(
            consoleOutput.concat({
              msg: "No submission found",
              msgType: ConsoleMessageType.Error,
            })
          );
          break;
        case AIErrorType.InvalidMove:
          setConsoleOutput(
            consoleOutput.concat({
              msg: "AI played invalid move",
              msgType: ConsoleMessageType.Error,
            })
          );
          break;
        case AIErrorType.InvalidOutput:
          setConsoleOutput(
            consoleOutput.concat({
              msg: "AI sent invalid output",
              msgType: ConsoleMessageType.Error,
            })
          );
          break;
      }

      if (turnStatus.ai_output && turnStatus.ai_output.length > 0) {
        setConsoleOutput(
          consoleOutput
            .concat({ msg: "AI error", msgType: ConsoleMessageType.Error })
            .concat({
              msg: turnStatus.ai_output,
              msgType: ConsoleMessageType.Warning,
            })
        );
      }

      setGameOngoing(false);
    } else {
      setBoard(rotateBoard(turnStatus.game.board, player)); // update board with server response
      setCurrentTurn(turnStatus.game.current_player);
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
                  createGame(username, player == Player.White).then(
                    (turnStatus) => {
                      setConsoleOutput([]);
                      setGameOngoing(true);
                      updateGame(turnStatus);
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
                  board={board}
                  setBoard={setBoard}
                  updateGame={updateGame}
                />
              </div>
              <div className="game-info">
                <p>Game State: {gameOngoing ? "Ongoing" : "Stopped"}</p>
                <p>Current Turn: {currentTurn ?? "None"}</p>
                <p>Player: {player}</p>
                {consoleOutput.map((line, i) => (
                  <p key={i} className={line.msgType}>
                    {line.msg}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="editor">
            <Editor
              theme="vs-dark"
              loading="Loading Editor..."
              language={selectedLang}
              value={file}
              onChange={(code: string | undefined) =>
                code ? setFile(code) : null
              }
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
