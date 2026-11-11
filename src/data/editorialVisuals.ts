/**
 * Original editorial artwork for the first issue.
 * These are AI-generated conceptual illustrations, not product screenshots or independent measurements.
 * Missing artwork should never block publication or be replaced with unrelated imagery.
 */
export type EditorialVisual = {
  src: string;
  alt: string;
  caption: string;
};

const visuals: Record<string, EditorialVisual> = {
  'gpt-6-cyber-security-research': {
    src: '/images/cyber-research.webp',
    alt: '回路の亀裂をレンズで調べ、透明な盾で守るCG。ソフトウェアの弱点の発見と保護を表す比喩。',
    caption: 'AI生成の概念CG。実際の製品・検証画面ではありません',
  },
  'cursor-agent-voice-chat': {
    src: '/images/voice-agent.webp',
    alt: 'パソコンとスマートフォンの間を音声の波形がつなぐAIエージェントの概念イラスト。',
    caption: 'AI生成の利用イメージ。Cursorの実際の画面ではありません',
  },
  'openai-images-2-6-gif': {
    src: '/images/image-to-motion.webp',
    alt: '紙のカードからハチドリが立体的に飛び立つCG。静止画から動く表現への変化を表す。',
    caption: 'AI生成の概念CG。Images 2.6の出力実例ではありません',
  },
};
export const articleVisual = (slug: string): EditorialVisual | undefined => visuals[slug];
