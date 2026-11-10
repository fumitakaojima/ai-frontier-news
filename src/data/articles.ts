import catalog from './articles.json';

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

export const issueDate: string = catalog.issueDate;
export const issueNumber: number = catalog.issueNumber;
export const articles: Article[] = catalog.articles as Article[];
