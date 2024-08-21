import Head from "next/head";
import { Inter } from "next/font/google";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import Board from "@/components/Board";
import { requireSession } from "./api/api";

const inter = Inter({ subsets: ["latin"] });

const files: {
  [key: string]: { name: string; language: string; value: string };
} = {
  java: {
    name: "Java",
    language: "java",
    value: "// Java",
  },
  cpp: {
    name: "C++",
    language: "cpp",
    value: "// C++",
  },
  python: {
    name: "Python",
    language: "python",
    value: "# Python",
  },
};

const exampleBoardState = `,,,,,,,,,
,,KB,,,,,,,
,,,,,,,,,
,,,,,MW,MW,,,
,,MB,,,,,,,
,,,,,KW,,,,
,,,,,,,,,
,,,,,,,,,
,,,,,,,,,
,,,,,,,,,`;

export default function Home(
  { username }: { username: string }
) {
  const [selectedLang, setLang] = useState("java");
  const file = files[selectedLang];

  const [value, setValue] = useState(file.value);

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
            <button className="run-button">Run</button>
            <select
              className="lang-select"
              value={selectedLang}
              onChange={(e) => setLang(e.target.value)}
            >
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="python">Python</option>
            </select>
          </div>
        </div>

        <div className="main-content">
          <div className="side-panel">
            <div className="instructions">
              <p>Welcome {username} !</p>
            </div>
            <div className="simulation">
              <Board boardState={exampleBoardState} />
            </div>
          </div>
          <div className="editor">
            <Editor
              theme="vs-dark"
              loading="Loading Editor..."
              path={file.name}
              defaultLanguage={file.language}
              defaultValue={file.value}
              value={value}
              onChange={(va) => setValue(va ?? "")}
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
