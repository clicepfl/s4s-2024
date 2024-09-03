import { API_URL } from '@/api/config';
import { SubmissionLanguage } from '../api/models';

export const initFiles: {
  [lang: string]: {
    name: string;
    extension: string;
  };
} = {
  [SubmissionLanguage.Java]: { name: 'Java', extension: 'java' },
  [SubmissionLanguage.Cpp]: { name: 'C++', extension: 'cpp' },
  [SubmissionLanguage.Python]: { name: 'Python', extension: 'py' },
};

export async function getInitialCode(
  lang: SubmissionLanguage
): Promise<string> {
  const path = `${API_URL}/base.${initFiles[lang].extension}`;
  const code = await fetch(path);
  return await code.text();
}
