import Head from "next/head";
import { Inter } from "next/font/google";
import Editor from "@monaco-editor/react";
import { useState } from "react";

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

export default function Home() {
  const [selectedLang, setLang] = useState("java");
  const file = files[selectedLang];

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
          <div className="instructions">
            <p>Instructions here</p>
          </div>
          <div className="editor">
            <Editor
              theme="vs-dark"
              loading="Loading Editor..."
              path={file.name}
              defaultLanguage={file.language}
              defaultValue={file.value}
            />
          </div>
        </div>
      </main>
    </>
  );
}
