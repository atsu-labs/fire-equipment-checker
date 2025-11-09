# Technology Stack

## Architecture

**ルールエンジン駆動型**: 消防法令をデータ構造化し、条件評価エンジンで設備要否を判定。フロントエンド完結型(Next.js SSG/SSR)でサーバーレス展開可能。

## Core Technologies

- **Language**: TypeScript (strict mode + noUncheckedIndexedAccess)
- **Framework**: Next.js 16 (App Router)
- **Runtime**: Node.js 20+
- **Package Manager**: pnpm 10+

## Key Libraries

- **Validation**: Zod 4.x - 厳格型バリデーション(BuildingInfo, ルールスキーマ)
- **Form**: React Hook Form 7.x + @hookform/resolvers
- **PDF**: @react-pdf/renderer 4.x - レポート生成
- **UI**: Tailwind CSS 4 + lucide-react (アイコン)
- **Testing**: Vitest 4.x (単体) + Playwright 1.x (E2E)

## Development Standards

### Type Safety
- TypeScript `strict: true` + `noUncheckedIndexedAccess: true` + `noImplicitAny: true`
- リテラル型活用: 47用途コード(`UsageCode`), 設備種別(`EquipmentType`)
- 条件式型定義: `Condition`, `Operator`, `ConditionType`
- `any` 使用禁止、型推論優先

### Code Quality
- **Linter**: ESLint 9 (Next.js + Prettier統合)
- **Formatter**: Prettier 3.x - 自動フォーマット必須
- **Commands**:
  ```bash
  pnpm lint          # ESLint実行
  pnpm format        # Prettier整形
  pnpm type-check    # 型チェック
  ```

### Testing
- **Unit**: Vitest - ルール評価ロジックのテスト(`lib/regulations/__tests__/`)
- **E2E**: Playwright - UI統合テスト
- **Commands**:
  ```bash
  pnpm test          # Vitest実行
  pnpm test:ui       # Vitest UI
  pnpm test:e2e      # Playwright実行
  ```

## Development Environment

### Required Tools
- Node.js 20.x以上
- pnpm 10.x以上

### Common Commands
```bash
pnpm install       # 依存関係インストール
pnpm dev           # 開発サーバー (localhost:3000)
pnpm build         # 本番ビルド
pnpm start         # 本番サーバー
```

## Key Technical Decisions

1. **法令のデータ駆動化**: 消防法施行令各条文を`InstallationRule[]`として構造化(article-10.ts ~ article-29.ts)。法改正時はデータ更新のみで対応。
2. **条件評価の汎用化**: `condition-evaluator.ts`で用途・面積・階数等の条件をJSON-like構造で表現し、動的評価。
3. **型安全な用途コード**: 47用途(`'1-i'`, `'2-ro'` etc.)をリテラル型として定義し、コンパイル時検証。
4. **パスエイリアス**: `@/*` で絶対パス指定、深いネストでも相対パス不要。

---
_created_at: 2025-11-09_
