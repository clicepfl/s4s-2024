// A components that allows the user to switch between different code snippets

import { SubmissionLanguage } from "@/api/models";
import { initFiles } from "@/util/initCodeFiles";
import Prism from "prismjs";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-java";
import "prismjs/components/prism-python";
import React, { useEffect } from "react";
import { useState } from "react";

interface CodeSwitcherProps {
  codeSnippets: { [lang: string]: string };
}

export default function CodeSwitcher({ codeSnippets }: CodeSwitcherProps) {
  const [selectedLang, setSelectedLang] = useState(SubmissionLanguage.Java);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Prism.highlightAll();
      console.log("highlight");
    }
  }, [selectedLang]);

  return (
    <div className="code-switcher">
      <select
        className="code-lang-select"
        value={selectedLang}
        onChange={(e) => setSelectedLang(e.target.value as SubmissionLanguage)}
      >
        {Object.values(SubmissionLanguage).map((lang) => (
          <option key={lang} value={lang}>
            {initFiles[lang].name}
          </option>
        ))}
      </select>
      <pre
        className={`code-zone language-${initFiles[selectedLang].extension}`}
      >
        <code>{codeSnippets[selectedLang]}</code>
      </pre>
    </div>
  );
}
