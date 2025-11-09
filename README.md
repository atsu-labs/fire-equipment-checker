# 消防用設備規制判別システム

消防法施行令別表第一に基づき、建築物の用途・規模から必要な消防用設備を自動判別するWebアプリケーション

## 🎯 概要

消防職員が建築物の情報(用途、延床面積、階数等)を入力すると、消防法令に基づいて必要な消防用設備を自動判別し、法令根拠付きのレポートを出力します。

**対象ユーザー**: 消防職員(査察、事前協議、適合調査、指導文書作成)

## 🚀 技術スタック

- **フロントエンド**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- **バリデーション**: Zod + React Hook Form
- **PDF生成**: @react-pdf/renderer
- **テスト**: Vitest + Playwright
- **デプロイ**: Cloudflare Pages (予定)

## 📦 セットアップ

### 前提条件

- Node.js 20.x以上
- pnpm 10.x以上

### インストール

```bash
# 依存関係のインストール
pnpm install

# 開発サーバー起動
pnpm dev
```

開発サーバーは http://localhost:3000 で起動します。

## 🛠️ 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# 本番ビルド
pnpm build

# 本番サーバー起動
pnpm start

# 型チェック
pnpm type-check

# リント
pnpm lint

# フォーマット
pnpm format

# 単体テスト
pnpm test

# テストUI
pnpm test:ui

# E2Eテスト
pnpm test:e2e
```

## 📁 ディレクトリ構造

```
fire-equipment-checker/
├── app/                        # Next.js App Router
│   ├── api/                    # API Routes
│   │   └── judge/              # 規制判別API
│   ├── layout.tsx              # ルートレイアウト
│   └── page.tsx                # トップページ
├── components/                 # Reactコンポーネント
│   ├── ui/                     # 汎用UIコンポーネント
│   ├── forms/                  # フォームコンポーネント
│   └── results/                # 結果表示コンポーネント
├── lib/                        # ライブラリコード
│   ├── regulations/            # 規制判別ロジック
│   │   ├── data/               # 法令マスタデータ
│   │   ├── types/              # 型定義
│   │   ├── utils/              # ユーティリティ
│   │   └── engine/             # 判別エンジン
│   └── utils.ts                # 共通ユーティリティ
├── public/                     # 静的ファイル
│   └── docs/                   # ドキュメント
└── docs/                       # プロジェクトドキュメント(親ディレクトリ)
```

## 📚 機能

### Phase 1 (現在開発中)

- [x] プロジェクトセットアップ
- [ ] 用途コードマスタデータ作成
- [ ] 建築物情報入力フォーム
- [ ] 規制判別エンジン実装
- [ ] 必要設備一覧表示
- [ ] PDF出力機能

### Phase 2 (将来拡張)

- [ ] ユーザー認証・認可
- [ ] 判別履歴保存・検索
- [ ] 建築物データベース構築
- [ ] 複数建築物一括判別
- [ ] 法改正通知機能

## 📖 関連ドキュメント



## 📝 法令情報

**基準法令**: 消防法施行令別表第一(令和7年10月1日施行版)

## 📄 ライセンス

Private - 消防職員向け業務支援ツール

## 👨‍💻 開発者

atsu-labs

---

**Repository**: https://github.com/atsu-labs/fire-equipment-regulation-checker


