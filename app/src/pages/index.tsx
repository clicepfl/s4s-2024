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
        <Editor
          className="editor"
          height="70vh"
          loading="Loading Editor..."
          defaultLanguage="java"
          defaultValue={""}
        />
      </main>
    </>
  );
}
