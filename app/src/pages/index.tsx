import Head from "next/head";
import { Inter } from "next/font/google";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import Board from "@/components/Board";
import { Board as BoardState, emptyBoard, SubmissionLanguage } from "./api/models";
import { createGame, requireSession, stopGame, submitCode } from "./api/api";

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
  const [files, setFiles] = useState(initFiles);
  const [boardState, setBoardState] = useState(emptyBoard);
  const [gameOngoing, setGameOngoing] = useState(false);

  function updateCode(lang: string, value: string) {
    setFiles({ ...files, [lang]: { ...files[lang], value } });
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
              onClick={() => {
                if (gameOngoing) {
                  stopGame(username);
                } else {
                  createGame(username, true) // TODO: allow user to choose first player
                }
              }}
            >
              {gameOngoing ? "Stop Game" : "Start Game"}
            </button>
            <button
              className="button"
              onClick={() =>
                submitCode(selectedLang, files[selectedLang].value, username)
              }
            >
              Submit
            </button>

            <select
              className="lang-select"
              value={selectedLang}
              onChange={(e) => setLang(e.target.value as SubmissionLanguage)}
            >
              {Object.values(SubmissionLanguage).map((lang) => (
                <option key={lang} value={lang}>
                  {files[lang].name}
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
            <div className="simulation">
              <Board board={boardState} />
            </div>
          </div>
          <div className="editor">
            <Editor
              theme="vs-dark"
              loading="Loading Editor..."
              path={selectedLang}
              defaultLanguage={selectedLang}
              value={files[selectedLang].value}
              onChange={(va) => (va ? updateCode(selectedLang, va) : null)}
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
