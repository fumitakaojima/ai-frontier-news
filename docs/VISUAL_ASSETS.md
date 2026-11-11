# 創刊号ビジュアルの制作・利用記録

制作・確認日: 2026-11-12。対象: Draft PR #4、feat/newspaper-first-view。

## 素材と表示

第三者サイトの写真・公式画像は転載していない。内蔵の画像生成ツールで本紙向けに独自制作し、ロゴ・実製品UI・人物を含めず、全画像をAI生成の概念表現として明示。製品の実物、実際の操作画面、性能試験、Images 2.6の出力例を示す資料ではない。第三者の素材ライセンスや帰属表示を必要とする画像は使用していない。AI生成物について排他的な著作権を保証するものではない。

| 記事 | 配信ファイル | 表現・注意 |
| --- | --- | --- |
| GPT-6 Cyber | public/images/cyber-research.webp | 回路の亀裂を調べるレンズと盾。ソフトウェアの弱点発見・保護の比喩であり、ハードウェア製品の写真ではない |
| Cursor Voice Chat | public/images/voice-agent.webp | PCとスマートフォンを音声波形でつなぐ利用イメージ。実際のCursor画面ではない |
| Images 2.6 / GIF | public/images/image-to-motion.webp | カードから飛び立つハチドリで静止画から動きへの変化を表現。静止CGでありGIF機能の実演ではない |

WebP圧縮済み、サイト内の静的ファイルとして配信。画像生成API、外部画像配信サービス、実行時の画像変換は追加していない。既存の無料ホスティング運用を維持。毎号の画像自動生成は実装していない。

## 制作プロンプト

方式: 内蔵 image_gen、stylized-concept、新規生成。共通条件: landscape 3:2, premium editorial image, no logos, no actual product UI, no text, no numbers, no watermark。

- Cyber: Photorealistic cinematic 3D macro illustration of a precision glass inspection lens scanning an intricate graphite circuit board, one fine amber fracture among cool cyan circuit traces, a translucent protective glass shield behind the inspected area. Machined metal, optical glass, restrained cyan glow, studio lighting, shallow depth of field. Conceptual metaphor for discovering and helping repair software vulnerabilities.
- Voice: Photorealistic editorial still life of an unbranded graphite laptop on warm oak, abstract blurred colored code on its dark screen, a smartphone with a cyan audio waveform, a delicate luminous wave connecting both devices. Morning window light, realistic metal and glass. Conceptual voice conversation with a coding agent; not an actual Cursor interface.
- Motion: An original sculptural orange paper hummingbird coming alive from a cream artist card into a dimensional orange and teal bird, translucent animation frames showing successive wing positions. Tactile paper sculpture and polished 3D, soft gallery lighting, ivory background. Metaphorical image-to-animation illustration; not an Images 2.6 output demonstration.

## 事実の保全

src/data/articles.json は変更せず、記事3本・出典・日付・発表値・検証上の留意点を維持。2026-11-12に以下の一次情報を再確認した。画像に性能数値や製品名を描き込まず、概念表現と発表事実を混同しない。

- https://openai.com/ja-JP/index/introducing-gpt-6-cyber/
- https://cursor.com/ja/changelog
- https://openai.com/ja-JP/index/introducing-images-2-6/

既存SVG図解は比較・説明用の原稿として保持するが、一面と記事詳細のメイン画像は上記WebPへ変更。将来公式画像を採用する場合は、取得元・再利用条件・出典・実物/概念の区別を個別に確認する。
