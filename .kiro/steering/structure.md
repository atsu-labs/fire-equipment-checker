# Project Structure

## Organization Philosophy

**ドメイン駆動レイヤー構造**: 消防法規制のドメインロジック(`lib/regulations/`)を中核に、UI(`app/`, `components/`)とデータ(`docs/`)を分離。法令知識をビジネスロジックとして構造化。

## Directory Patterns

### App Layer (`app/`)
**Purpose**: Next.js App Router - ページ、レイアウト、APIルート  
**Example**:
```
app/
  layout.tsx           # ルートレイアウト
  page.tsx             # トップページ
  api/judge/route.ts   # 規制判別API
```
**Convention**: ファイル名は Next.js 規約に従う(page.tsx, layout.tsx, route.ts)

### Components Layer (`components/`)
**Purpose**: Reactコンポーネント - 機能別ディレクトリ分割  
**Example**:
```
components/
  ui/        # 汎用UIコンポーネント(Button, Input等)
  forms/     # フォームコンポーネント(BuildingForm等)
  results/   # 結果表示コンポーネント(JudgmentReport等)
```
**Convention**: PascalCaseファイル名(BuildingForm.tsx), エクスポートは名前付き+default

### Regulations Domain (`lib/regulations/`)
**Purpose**: 消防法規制のビジネスロジック - コアドメイン  
**Structure**:
```
lib/regulations/
  types/           # 型定義(UsageCode, InstallationRule, BuildingInfo等)
  data/            # マスタデータ
    rules/         # 条文別ルール定義(article-10.ts ~ article-29.ts)
  engine/          # 判別エンジン
    regulation-judge.ts       # 規制判別メインロジック
    condition-evaluator.ts    # 条件評価ロジック
  utils/           # スキーマ、ユーティリティ
  __tests__/       # Vitestテスト(article-*.test.ts)
```
**Convention**:
- `article-{番号}.ts`: 条文番号に対応(例: article-10.ts = 令第10条)
- `InstallationRule[]` 配列エクスポート(例: `FIRE_EXTINGUISHER_RULES`)

### Documentation (`docs/`)
**Purpose**: 法令原文・参照資料  
**Example**:
```
docs/
  legal-articles.md              # 法令条文まとめ
  required-building-attributes.md # 建築物属性定義
  articles/                       # 条文別詳細(article-10.txt等)
```
**Convention**: 法令原文はテキスト形式で保持、コード実装の根拠として参照

## Naming Conventions

- **Files**: 
  - Components: PascalCase (BuildingForm.tsx)
  - Utilities: kebab-case (regulation-judge.ts, condition-evaluator.ts)
  - Tests: {target}.test.ts (article-10.test.ts)
- **Types**: PascalCase (UsageCode, InstallationRule, BuildingInfo)
- **Functions**: camelCase (evaluateConditions, judgeRegulations)
- **Constants**: UPPER_SNAKE_CASE (FIRE_EXTINGUISHER_RULES, INSTALLATION_RULES)

## Import Organization

```typescript
// 1. 外部ライブラリ
import { z } from 'zod';
import type { NextRequest } from 'next/server';

// 2. 内部モジュール(絶対パス)
import type { BuildingInfo, InstallationRule } from '@/lib/regulations/types';
import { evaluateConditions } from '@/lib/regulations/engine';

// 3. 相対パス(同一ディレクトリ内)
import { FIRE_EXTINGUISHER_RULES } from './article-10';
```

**Path Aliases**:
- `@/*`: プロジェクトルート(`/`)にマップ

## Code Organization Principles

1. **ドメインロジックの独立性**: `lib/regulations/` は React/Next.js に依存しない純粋TypeScript。UIフレームワーク変更に強い。
2. **条文→コード対応**: `lib/regulations/data/rules/article-{番号}.ts` ファイル名と法令条文番号を一致させ、追跡性確保。
3. **型安全なルール定義**: `InstallationRule` 型で条件・根拠・優先度を構造化。コンパイル時検証。
4. **テストファイル配置**: `__tests__/` ディレクトリにテスト集約、`{target}.test.ts` でテスト対象明示。

---
_created_at: 2025-11-09_
