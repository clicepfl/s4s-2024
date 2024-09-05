// A components that allows the user to switch between different code snippets

import { SubmissionLanguage } from "@/api/models";
import { initFiles } from "@/util/initCodeFiles";
import React from "react";
import { useState } from "react";

interface CodeSwitcherProps {
  codeSnippets: { [lang : string]: string };
}

export default function CodeSwitcher({ codeSnippets }: CodeSwitcherProps) {
  const [selectedLang, setSelectedLang] = useState(SubmissionLanguage.Java);

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
      <pre className="code-zone">
        <code>{codeSnippets[selectedLang]}</code>
      </pre>
    </div>
  );
}
