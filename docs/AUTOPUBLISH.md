# AI最前線新聞｜毎朝自動発行の運用仕様

状態：**プログラム実装／実アカウント接続は未検証**。この文書の作成だけでは自動発行が稼働したことにはなりません。

## 発行サイクル

毎朝08:17（日本時間）に GitHub Actions の `AI FRONTIER Daily Edition` が実行されます。GitHub側の混雑により遅延する場合があります。全候補が品質条件を満たさなければ新号は発行せず、最新の検証済み号を維持します。

### 自動処理の順序

1. 公式RSS（OpenAI、Google DeepMind、GitHub Blog、Claude Code）を読み、公開日・トピック・許可ドメイン・重複を確認
2. 元ページが取得できれば本文を、取得できなければ公式RSS内の情報だけを根拠に使用。不足する場合は公開保留
3. Workers AIが日本語の見出し・要約・技術解説・読者への意味を生成
4. 根拠センテンスのID、数値と原文、別のAIレビュー処理を照合。不一致なら保留
5. 記事の内容から概念CGを独自生成。画像は実製品写真、実際の操作画面、性能試験結果とは表示しない
6. 1～2記事が通過した場合のみ次号JSONと画像を作成し、全アーカイブの静的検査・Astroビルドを実施
7. 成功した場合にだけ `main` にコミットし、Cloudflare PagesのGitHub連携で本番更新を試みる

APIキーを表示したり、ログに吐いたり、Gitへ格納したりしません。

## 絶対条件：月額0円

**Workers AIは必ずCloudflare Workers Freeプランで使用してください。** 2026年11月のCloudflare公式資料では、Workers Freeは1日10,000 Neuronsまで無料で、超過時はリクエストが失敗します。Workers Paidにすると超過利用が課金されるため、移行しないでください。

採用モデル：
- 日本語記事と照合：`@cf/zai-org/glm-4.7-flash`（Workers Free対象）
- 編集用概念CG：`@cf/black-forest-labs/flux-1-schnell`（Workers Freeの無料枠内で使用）
- 他社の有料生成API、画像配信、課金サービスは使用しません

同一Cloudflareアカウントで別のWorkers AI機能を大量利用した場合、無料枠を消費して本紙の発行が停止する可能性があります。**発行停止は許容、勝手に課金することは許容しない**方針です。

## 最初の1回だけ必要なアカウント設定

AIモデルをGitHub Actionsから呼ぶにはCloudflareのアカウントIDと専用APIトークンが必要です。**値をChatGPTや公開Issue、PR、README、ターミナルのスクリーンショットに貼り付けないでください。**

1. Cloudflare管理画面で Workers **Free** プランであることを確認（Paidにしない）
2. Workers AIの「Use REST API」から、必要最小限の `Workers AI Read` / `Workers AI Edit` 権限を持つ専用APIトークンを作る（Global API Keyは使わない）
3. GitHubリポジトリ `Settings → Secrets and variables → Actions → Repository secrets` に次の2つを登録する：
   - `CF_ACCOUNT_ID`：CloudflareのアカウントID
   - `CF_WORKERS_AI_TOKEN`：上で作成したWorkers AI専用APIトークン
4. 同じ `Actions → Variables` に `CF_WORKERS_FREE_CONFIRMED` を値 `true` で作成する。Freeプランを確認できた場合に限る
5. GitHub `Actions → AI FRONTIER Daily Edition → Run workflow` で手動試験する。新号生成・ビルド・自動コミット・Cloudflareへの反映が確認できれば日次自動発行のセットアップ完了

いずれかが未設定なら処理は `NO_EDITION` で安全停止します。

## 確認と異常時の対応

- `NO_EDITION`：新着なし／根拠不足／API認証不足／無料枠未確認。新号を発行しない
- `HELD`：候補記事に根拠不足、内容検査不合格、画像生成失敗などがあり保留した
- `EDITION_CREATED`：新号JSON・画像が生成された（その後のビルド・コミットの成功も別途確認する）
- `src/data/issues/YYYY-MM-DD.json`：発行済み号の永続スナップショット
- `src/data/articles.json`：最新号
- `src/data/visuals.generated.json`：自動生成画像の出典表示とalt
- `public/images/auto/*.jpg`：自動生成した概念CG

発行停止・訂正が必要なときはGitHub Actionsでワークフローを無効化し、新しい記事を公開しない状態にしてください。既存の公開記事は消しません。事実誤認の訂正は専用コミットで履歴を残してください。

## 残る運用品質上の課題

- 完全独立の第三者ファクトチェックではない。自動照合は根拠ID・数値とモデル審査の組み合わせであり、誤報リスクはゼロではない
- Web本文の取得がブロックされるサイトは、公式RSSの要約だけから推測せず公開保留する可能性がある
- AI生成の概念CGはニュースを説明するための表現であり、実物・実測値・機能動作を示さない
- 技術者・研究者・PdM・ビジネス実践者の自動発掘は今回の公式ソースMVPの対象外。後続の拡張候補
- GitHub ActionsによるコミットがCloudflare Pages側で確実に新しい本番デプロイを起動するかは、認証情報登録後の実発行テストで確認が必要
- GitHub Actionsは60日間リポジトリ活動がない公開リポジトリで定期実行が停止する場合がある
- モデルとCloudflareのFree枠・使用条件は変更される可能性があるため、定期的に公式ドキュメントを確認

参考：
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/workers-ai/get-started/rest-api/
- https://developers.cloudflare.com/workers-ai/models/glm-4.7-flash/
- https://developers.cloudflare.com/workers-ai/models/flux-1-schnell/
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows
