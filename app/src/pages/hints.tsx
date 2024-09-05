import { SubmissionLanguage } from "@/api/models";
import CodeSwitcher from "@/components/CodeSwitcher";
import { getInitialCode, initFiles } from "@/util/initCodeFiles";

export default function Hints() {
  return (
    <main>
      <div className="topbar">
        <img className="logo" src="../s4s/clic.svg" />
        <h1>Hints</h1>
        <div></div>
      </div>

      <div className="article-page">
        <p>
          This page is a placeholder for the hints feature. The hints feature
          will show the user possible moves for a piece. The user can enable or
          disable the hints feature.
        </p>

        <CodeSwitcher
          codeSnippets={{
            [SubmissionLanguage.Java]: "test code java",
            [SubmissionLanguage.Cpp]: "test code cpp",
            [SubmissionLanguage.Python]: "test code python",
          }}
        ></CodeSwitcher>
      </div>
    </main>
  );
}
