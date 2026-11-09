export type Article = {
  slug: string;
  title: string;
  summary: string;
  technical: string[];
  category: string;
  articleType: '研究・ブレークスルー' | '実用技術' | '専門家の実践';
  publishedAt: string;
  readMinutes: number;
  sources: { label: string; url: string }[];
  isDemo: true;
};

export const issueDate = '2026-11-09';

export const articles: Article[] = [
  {
    slug: 'agent-workflow-example',
    title: 'AIエージェントの役割分担をどう設計するか',
    summary: 'AIに調査・実装・確認を分担させる設計を考えます。並列化は有効な場合がありますが、調整の手間や費用も増えるため、作業の性質に応じた判断が必要です。',
    technical: [
      'オーケストレーターが作業を分割し、専門エージェントの実行結果を統合する方式を例に考えます。',
      '比較には、タスク成功率・実行時間・推論コスト・失敗時の復旧率を用います。',
      'これは構成例の説明です。特定製品の性能向上を確認した報道ではありません。'
    ],
    category: 'AIエージェント',
    articleType: '実用技術',
    publishedAt: issueDate,
    readMinutes: 4,
    sources: [],
    isDemo: true
  },
  {
    slug: 'research-evidence-example',
    title: '新しいAI研究を読むときに確認したいこと',
    summary: '研究の発表と、実際の効果が独立して確認されたことは異なります。評価データ、比較条件、再現可能性を確かめる視点を紹介します。',
    technical: [
      'ベンチマークは評価対象、データセット、計測条件、統計的な不確実性まで確認する必要があります。',
      'モデルに有利な条件だけを選んでいないか、再現コードや研究の限界が示されているかを検討します。'
    ],
    category: '最先端研究',
    articleType: '研究・ブレークスルー',
    publishedAt: issueDate,
    readMinutes: 3,
    sources: [],
    isDemo: true
  },
  {
    slug: 'field-notes-example',
    title: '現場のAI活用事例を評価する3つの視点',
    summary: '専門家やPdMによるAI活用事例では、便利だったという感想だけでなく、具体的な手順、比較対象、再現条件を確認することが大切です。',
    technical: [
      '導入前の処理時間や品質を基準として記録し、介入後の変化と外部要因を区別します。',
      '個人の報告、公開デモ、独立した検証結果を別々の証拠レベルとして扱います。'
    ],
    category: '現場の実践',
    articleType: '専門家の実践',
    publishedAt: issueDate,
    readMinutes: 3,
    sources: [],
    isDemo: true
  }
];
