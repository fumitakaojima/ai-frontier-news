import { readFileSync } from 'node:fs';

const source = readFileSync(new URL('../src/data/articles.ts', import.meta.url), 'utf8');
const sampleCount = (source.match(/isDemo:\s*true/g) ?? []).length;
if (sampleCount < 3) {
  console.error('試作記事のサンプル表示が不足しています。');
  process.exit(1);
}
console.log('試作記事の明示を確認しました。');
