import Head from "next/head";
import { Inter } from "next/font/google";
import Editor from "@monaco-editor/react";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
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
            <select className="lang-select">
              <option value="java">Java</option>
              <option value="c++">C++</option>
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
              defaultLanguage="java"
              defaultValue={""}
            />
          </div>
        </div>
      </main>
    </>
  );
}
