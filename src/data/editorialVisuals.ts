/**
 * Original editorial artwork for the first issue.
 * These are conceptual diagrams, not product screenshots or independent measurements.
 * Missing artwork should never block publication or be replaced with unrelated imagery.
 */
export type EditorialVisual = {
  src: string;
  alt: string;
  caption: string;
};

const visuals: Record<string, EditorialVisual> = {
  'gpt-6-cyber-security-research': {
    src: '/illustrations/cyber-research.svg',
    alt: 'ソフトウェアの脆弱性調査の概念図と、OpenAI発表のExploitGym比較値48.5%・32.1%を示す編集用図解。',
    caption: '編集部制作の概念図。数値はOpenAIの発表値（独立検証ではありません）',
  },
  'cursor-agent-voice-chat': {
    src: '/illustrations/voice-agent.svg',
    alt: 'パソコンとスマートフォンの間を音声の波形がつなぐAIエージェントの概念イラスト。',
    caption: '編集部制作のイメージ図。Cursorの実際の画面ではありません',
  },
  'openai-images-2-6-gif': {
    src: '/illustrations/image-to-gif.svg',
    alt: '同じイラストが4コマにわたって動く様子を描き、静止画像からGIFへの変化を表現した図解。',
    caption: '編集部制作のイメージ図。実際の生成結果ではありません',
  },
};
export const articleVisual = (slug: string): EditorialVisual | undefined => visuals[slug];
