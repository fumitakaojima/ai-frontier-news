import { readFileSync } from 'node:fs';

const data = JSON.parse(readFileSync(new URL('../src/data/articles.json', import.meta.url), 'utf8'));
const trustedHosts = new Set(['openai.com', 'www.anthropic.com', 'cursor.com', 'github.blog', 'blog.google']);
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const isISODate = (value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value));

assert(isISODate(data.issueDate), '発行日が不正です');
assert(Number.isInteger(data.issueNumber) && data.issueNumber > 0, '号数が不正です');
assert(Array.isArray(data.articles) && data.articles.length >= 1 && data.articles.length <= 3, '1号あたりの発行件数は1〜3件です');

const slugs = new Set();
for (const article of data.articles) {
  assert(/^[a-z0-9-]+$/.test(article.slug), '記事slugが不正です');
  assert(!slugs.has(article.slug), '記事slugが重複しています');
  slugs.add(article.slug);
  assert(article.title?.length >= 12, '記事見出しが不足しています');
  assert(article.summary?.length >= 40, '30秒要約が不足しています');
  assert(Array.isArray(article.technical) && article.technical.length >= 2, '技術解説が不足しています');
  assert(article.whyItMatters?.length >= 20, '意義の説明が不足しています');
  assert(article.caveat?.length >= 20, '検証上の留意点が不足しています');
  assert(isISODate(article.publishedAt) && isISODate(article.announcedAt), '記事の日付が不正です');
  assert(article.publishedAt === data.issueDate, '発行日と記事の日付が一致しません');
  assert(article.announcedAt <= article.publishedAt, '発表日が発行日より後です');
  assert(Array.isArray(article.sources) && article.sources.length >= 1, '出典のない記事は公開できません');
  for (const source of article.sources) {
    const url = new URL(source.url);
    assert(url.protocol === 'https:' && trustedHosts.has(url.hostname), '許可されない出典ドメインです');
    assert(source.label?.length >= 10, '出典の説明が不足しています');
  }
}
console.log('初号の出典・形式・日付・掲載件数の静的検査が成功しました。');
console.log('注：URLの実在や主張の裏付けを自動検証したものではありません。');
