import latest from './articles.json';

export type Article = {
  slug: string;
  title: string;
  summary: string;
  technical: string[];
  whyItMatters: string;
  caveat: string;
  category: string;
  articleType: '研究・ブレークスルー' | '実用技術' | '専門家の実践';
  publishedAt: string;
  announcedAt: string;
  readMinutes: number;
  sources: { label: string; url: string }[];
};

export type Issue = { issueDate: string; issueNumber: number; articles: Article[] };

const archivedModules = import.meta.glob<{ default: Issue }>('./issues/*.json', { eager: true });
export const issues: Issue[] = Object.values(archivedModules)
  .map((module) => module.default)
  .sort((a, b) => b.issueDate.localeCompare(a.issueDate));

export const allArticles: Article[] = issues.flatMap((issue) => issue.articles);
export const issueDate: string = latest.issueDate;
export const issueNumber: number = latest.issueNumber;
export const articles: Article[] = latest.articles as Article[];
