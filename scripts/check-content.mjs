import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const json = (filename) => JSON.parse(readFileSync(resolve(root, filename), 'utf8'));
const current = json('src/data/articles.json');
const fileNames = readdirSync(resolve(root, 'src/data/issues'))
  .filter((name) => /^\d{4}-\d{2}-\d{2}\.json$/.test(name))
  .sort();
const issues = fileNames.map((name) => json('src/data/issues/' + name));

const trustedHosts = new Set([
  'openai.com', 'www.openai.com',
  'www.anthropic.com', 'anthropic.com',
  'cursor.com', 'github.blog',
  'deepmind.google', 'code.claude.com',
  'blog.google',
]);
const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};
const isISODate = (value) =>
  typeof value === 'string' &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) === value;

assert(issues.length >= 1, 'At least one archived issue required.');
assert(current.issueDate === issues.at(-1).issueDate, 'Latest issue does not match archive.');
assert(JSON.stringify(current) === JSON.stringify(issues.at(-1)), 'Latest issue differs from its archived snapshot.');

const articleSlugs = new Set();
const issueDates = new Set();
let articleCount = 0;

for (const issue of issues) {
  assert(isISODate(issue.issueDate), 'Invalid issue date.');
  assert(!issueDates.has(issue.issueDate), 'Repeated issue date.');
  issueDates.add(issue.issueDate);
  assert(Number.isInteger(issue.issueNumber) && issue.issueNumber >= 1, 'Invalid issue number.');
  assert(Array.isArray(issue.articles) && issue.articles.length >= 1 && issue.articles.length <= 3, 'Issue must have 1-3 articles.');
  for (const article of issue.articles) {
    articleCount++;
    assert(typeof article.slug === 'string' && /^[a-z0-9-]{8,120}$/.test(article.slug), 'Invalid slug.');
    assert(!articleSlugs.has(article.slug), 'Historical article URL collision.');
    articleSlugs.add(article.slug);
    assert(typeof article.title === 'string' && article.title.length >= 12 && article.title.length <= 100, 'Title length invalid.');
    assert(typeof article.summary === 'string' && article.summary.length >= 40 && article.summary.length <= 550, 'Summary length invalid.');
    assert(Array.isArray(article.technical) && article.technical.length >= 2 && article.technical.length <= 4, 'Technical details missing.');
    assert(article.technical.every(p => typeof p === 'string' && p.length >= 30), 'Technical detail too short.');
    assert(typeof article.whyItMatters === 'string' && article.whyItMatters.length >= 20, 'Why-it-matters missing.');
    assert(typeof article.caveat === 'string' && article.caveat.length >= 20, 'Limitations missing.');
    assert(typeof article.category === 'string' && article.category.length >= 2, 'Category missing.');
    assert(isISODate(article.publishedAt) && isISODate(article.announcedAt), 'Invalid article dates.');
    assert(article.publishedAt === issue.issueDate, 'Article published date must match its issue.');
    assert(article.announcedAt <= article.publishedAt, 'Source announcement is after issue date.');
    assert(Number.isInteger(article.readMinutes) && article.readMinutes >= 1 && article.readMinutes <= 30, 'Reading time invalid.');
    assert(Array.isArray(article.sources) && article.sources.length >= 1 && article.sources.length <= 4, 'Primary source missing.');
    for (const source of article.sources) {
      const url = new URL(source.url);
      assert(url.protocol === 'https:' && trustedHosts.has(url.hostname), 'Source domain not trusted.');
      assert(typeof source.label === 'string' && source.label.length >= 10, 'Source label missing.');
    }
  }
}
for (let i = 1; i < issues.length; i++) {
  assert(issues[i].issueNumber > issues[i - 1].issueNumber, 'Issue numbers must increase.');
}
const visuals = json('src/data/visuals.generated.json');
for (const [slug, item] of Object.entries(visuals)) {
  assert(articleSlugs.has(slug), 'Visual exists for unknown article.');
  assert(typeof item.src === 'string' && /^\/images\/auto\/[a-z0-9-]+\.jpg$/.test(item.src), 'Unsafe image path.');
  assert(existsSync(resolve(root, 'public', item.src.slice(1))), 'Generated visual asset missing.');
  assert(typeof item.alt === 'string' && item.alt.length >= 20, 'Image alt missing.');
  assert(typeof item.caption === 'string' && item.caption.length >= 20, 'Concept art disclosure missing.');
}
console.log('Content validation passed: ' + issues.length + ' archived issues, ' + articleCount + ' unique articles.');
console.log('Warning: formatting checks and URL allowlists are NOT independent factual verification.');
