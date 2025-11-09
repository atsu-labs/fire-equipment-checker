# Implementation Gap Analysis: building-input-ui

## Executive Summary

**スコープ**: 消防用設備規制判別システムの建築物情報入力UIをゼロから構築

**主要な課題**:
- UIコンポーネントが完全に未実装(`components/`ディレクトリは空)
- 型定義・スキーマは一部存在するが、複合用途対応(`FloorUsageDetail[]`)の入力UIロジックが未実装
- `/api/judge` APIエンドポイントが未実装
- React Hook Form + Zodによるバリデーション統合が未構築

**推奨アプローチ**: **Option B - Create New Components** (新規コンポーネント作成)  
理由: 既存UIコンポーネントが存在せず、フォーム機能は独立した責任範囲を持つため

**実装複雑度**: **M (Medium, 3-7日)**  
**リスク**: **Medium** - React Hook Form + Zod統合、動的テーブル入力のUXパターンに実装指針が必要

---

## 1. Current State Investigation

### 1.1 Domain Assets

#### 型定義 (完全実装済み)
- **`lib/regulations/types/index.ts`**:
  - `UsageCode`: 47用途コードのリテラル型 ✅
  - `BuildingInfo`: 建築物情報の包括的な型定義 ✅
  - `FloorUsageDetail`: 階×用途マトリクスの型定義 ✅
  - `UsageType`: 用途メタデータ型 ✅

#### バリデーションスキーマ (部分実装)
- **`lib/regulations/utils/schemas.ts`**:
  - `usageCodeSchema`: 用途コードのZod検証スキーマ ✅
  - `buildingInfoSchema`: 基本属性のZod検証スキーマ ✅
  - `buildingInfoFormSchema`: フォーム入力用スキーマ(文字列→数値変換) ✅
  - **ギャップ**: `FloorUsageDetail[]`のスキーマが未定義 ❌
  - **ギャップ**: 特殊属性(`isWindowless`, `directStairCount`等)のスキーマが未定義 ❌

#### マスタデータ (完全実装済み)
- **`lib/regulations/data/usage-types.ts`**:
  - `USAGE_TYPES`: 47用途コードの完全なマスタデータ ✅
  - `getUsageType()`: 用途コード→メタデータ取得関数 ✅

### 1.2 UI Layer (完全未実装)

- **`components/forms/`**: 空ディレクトリ ❌
- **`components/ui/`**: 空ディレクトリ ❌
- **`components/results/`**: 空ディレクトリ ❌
- **`app/page.tsx`**: Next.jsデフォルトのプレースホルダー ❌

### 1.3 API Layer (未実装)

- **`app/api/judge/`**: ディレクトリ自体が存在しない ❌
- 規制判別エンジンへの統合ロジックが未実装

### 1.4 技術スタック確認

#### 利用可能なライブラリ
- **React Hook Form 7.66.0** + **@hookform/resolvers 5.2.2** ✅
- **Zod 4.1.12** ✅
- **Tailwind CSS 4** ✅
- **lucide-react 0.553.0** ✅
- **Next.js 16.0.1 (App Router)** ✅

#### テスト環境
- **Vitest 4.0.8** + **@testing-library/react 16.3.0** ✅
- **Playwright 1.56.1** ✅

---

## 2. Requirements Feasibility Analysis

### 2.1 Technical Needs

#### Requirement 1: 用途コード選択機能
- **必要な実装**:
  - ドロップダウン/セレクトボックスコンポーネント
  - `USAGE_TYPES`からカテゴリ別グループ化ロジック
  - 複合用途((16)項)選択時のUI状態切り替えロジック
- **既存資産**: `USAGE_TYPES`, `UsageCode`型, `usageCodeSchema` ✅
- **ギャップ**: UIコンポーネント未実装 ❌

#### Requirement 2: 基本属性入力機能
- **必要な実装**:
  - 数値入力フィールドコンポーネント(延床面積、階数、地階数)
  - リアルタイムバリデーション表示
  - React Hook Formとの統合
- **既存資産**: `buildingInfoFormSchema`(文字列→数値変換付き) ✅
- **ギャップ**: 入力コンポーネント未実装 ❌

#### Requirement 3: 階別用途詳細入力機能
- **必要な実装**:
  - 動的テーブル(行追加/削除機能)
  - `FloorUsageDetail[]`配列のフィールド管理
  - 用途別床面積合計の自動計算ロジック
  - React Hook Form `useFieldArray`の活用
- **既存資産**: `FloorUsageDetail`型定義 ✅
- **ギャップ**: 
  - `FloorUsageDetail[]`のZodスキーマ未定義 ❌
  - 動的フォーム配列のUIパターン未実装 ❌
  - 自動計算ロジック未実装 ❌

#### Requirement 4: 特殊属性入力機能
- **必要な実装**:
  - チェックボックスコンポーネント(無窓階、避難階等)
  - 条件付きフィールド表示(階数≥3階 → 直通階段数表示)
  - React Hook Form `watch()`による動的制御
- **既存資産**: `BuildingInfo`型に属性定義済み ✅
- **ギャップ**: 
  - Zodスキーマ未定義 ❌
  - 条件付き表示ロジック未実装 ❌

#### Requirement 5: バリデーション機能
- **必要な実装**:
  - React Hook Form + Zod Resolver統合
  - エラーメッセージ表示コンポーネント
  - `formState.errors`のUI反映
  - フォーカスアウト時バリデーション(`mode: 'onBlur'`)
- **既存資産**: Zodスキーマ(基本属性のみ) ✅
- **ギャップ**: 
  - 包括的なスキーマ(階別詳細、特殊属性含む)未定義 ❌
  - エラー表示UIパターン未実装 ❌

#### Requirement 6: フォーム送信機能
- **必要な実装**:
  - `/api/judge`エンドポイント作成
  - `BuildingInfo`型へのデータ整形
  - ネットワークエラーハンドリング
  - ローディング状態管理
  - 結果画面への遷移ロジック
- **既存資産**: `RegulationJudge`クラス(`lib/regulations/engine/`) ✅
- **ギャップ**: 
  - APIエンドポイント未実装 ❌
  - フォーム送信ハンドラー未実装 ❌
  - 結果画面未実装 ❌

#### Requirement 7: UIデザイン・アクセシビリティ
- **必要な実装**:
  - Tailwind CSSによるスタイリング
  - lucide-reactアイコン統合
  - レスポンシブデザイン
  - キーボードナビゲーション対応
- **既存資産**: Tailwind CSS 4, lucide-react ✅
- **ギャップ**: デザインシステム/コンポーネント未構築 ❌

#### Requirement 8: データ永続化・入力リセット機能
- **必要な実装**:
  - localStorage自動保存ロジック
  - ページリロード時の復元
  - 確認ダイアログ付きクリア機能
  - `useEffect`によるフォーム状態同期
- **既存資産**: なし
- **ギャップ**: localStorage統合ロジック未実装 ❌

### 2.2 Non-Functional Requirements

#### Performance
- **要件**: バリデーション100ms以内、100行テーブルでも遅延なし
- **実装**: React Hook Formは最適化済み、useMemoでの集計計算最適化が必要
- **リスク**: **Low** - 既知のパフォーマンスパターン適用可

#### Type Safety
- **要件**: TypeScript strict mode + `BuildingInfo`型の正確な使用
- **既存**: `strict: true`, `noUncheckedIndexedAccess: true` 設定済み ✅
- **リスク**: **Low** - 型定義完備

#### Compatibility
- **要件**: Chrome/Firefox/Edge/Safari 100+, 画面幅768px以上
- **実装**: Tailwind CSSのレスポンシブユーティリティ使用
- **リスク**: **Low** - 標準的なブラウザ対応

---

## 3. Implementation Approach Options

### Option A: Extend Existing Components ❌ 不適用

**理由**: `components/`ディレクトリが完全に空のため、拡張対象が存在しない。

---

### Option B: Create New Components ✅ 推奨

**Rationale for New Creation**:
- UIコンポーネントが完全に未実装のため、新規作成が必須
- 建築物入力フォームは独立した責任範囲を持つ(規制判別エンジンとの分離)
- Next.js App Routerのベストプラクティスに従った構造化が可能

**Component Structure Proposal**:
```
components/
  forms/
    BuildingInputForm.tsx           # メインフォームコンポーネント
    UsageCodeSelect.tsx             # 用途コード選択コンポーネント
    BasicAttributesSection.tsx      # 基本属性入力セクション
    FloorUsageTable.tsx             # 階別用途詳細テーブル
    SpecialAttributesSection.tsx    # 特殊属性入力セクション
  ui/
    Input.tsx                       # 汎用入力フィールド
    Select.tsx                      # 汎用セレクトボックス
    Checkbox.tsx                    # 汎用チェックボックス
    Button.tsx                      # 汎用ボタン
    ErrorMessage.tsx                # エラーメッセージ表示
    ConfirmDialog.tsx               # 確認ダイアログ

app/
  page.tsx                          # フォーム表示ページ(書き換え)
  api/
    judge/
      route.ts                      # 規制判別APIエンドポイント

lib/regulations/utils/
  schemas.ts                        # Zodスキーマ拡張
  form-helpers.ts                   # フォーム用ヘルパー関数(NEW)
```

**Integration Points**:
- **データ層**: `lib/regulations/types`, `lib/regulations/data/usage-types.ts`から型・マスタデータをインポート
- **バリデーション**: `lib/regulations/utils/schemas.ts`のスキーマを拡張
- **規制判別**: `lib/regulations/engine/regulation-judge.ts`を`/api/judge`で呼び出し

**Responsibility Boundaries**:
- **`BuildingInputForm`**: フォーム全体のオーケストレーション、送信処理
- **セクションコンポーネント**: 機能単位の入力UI、バリデーション表示
- **`ui/`**: 再利用可能なプリミティブコンポーネント、デザインシステム準拠
- **`/api/judge`**: 規制判別ロジックの実行、結果返却

**Trade-offs**:
- ✅ **Clean separation of concerns**: 機能別コンポーネント分割で保守性向上
- ✅ **Easier to test in isolation**: 各コンポーネントを独立してテスト可能
- ✅ **Follows Next.js App Router patterns**: ベストプラクティス準拠
- ❌ **More files to navigate**: 初期ファイル数増加(10-15ファイル)
- ❌ **Requires careful interface design**: コンポーネント間のprops設計が重要

---

### Option C: Hybrid Approach ❌ 不適用

**理由**: 拡張対象のコンポーネントが存在しないため、ハイブリッドアプローチは不要。

---

## 4. Research Needed

以下の項目は設計フェーズでの調査・決定が必要:

1. **複合用途入力のUXパターン**:
   - 単一用途と複合用途の入力モード切り替えUI
   - 階別詳細テーブルの行追加/削除のインタラクションデザイン
   - 用途別床面積合計の表示位置・タイミング

2. **React Hook Form useFieldArray パターン**:
   - `FloorUsageDetail[]`の動的配列管理ベストプラクティス
   - 各行のバリデーションエラー表示方法
   - 行削除時のバリデーション再実行

3. **localStorage統合パターン**:
   - フォーム状態の自動保存タイミング(onChange vs onBlur)
   - 復元時のバリデーション実行
   - セキュリティ考慮(localStorage容量制限、XSS対策)

4. **エラーメッセージの日本語化**:
   - Zodのエラーメッセージカスタマイズ方法
   - 消防職員向けのわかりやすい表現

5. **API Route実装パターン**:
   - Next.js 16 App Router での POST リクエストハンドリング
   - `RegulationJudge`クラスのサーバーサイド実行
   - エラーレスポンスの構造化

---

## 5. Implementation Complexity & Risk

### 5.1 Effort Estimation: **M (Medium, 3-7日)**

**内訳**:
- 基本UIコンポーネント(`ui/`): 1日
- 基本属性入力セクション: 0.5日
- 用途コード選択(グループ化、複合用途切り替え): 1日
- 階別用途詳細テーブル(動的配列、自動計算): 1.5日
- 特殊属性入力(条件付き表示): 0.5日
- バリデーション統合・エラー表示: 1日
- `/api/judge`実装: 0.5日
- localStorage統合: 0.5日
- テスト作成: 1日

**根拠**: 
- React Hook Form + Zodの統合パターンは確立済み
- 動的テーブル入力の実装が中程度の複雑度
- UIコンポーネント数が多いが、各コンポーネントは標準的

### 5.2 Risk: **Medium**

**High Risk要素なし**:
- 使用技術すべてプロジェクトに導入済み
- 型定義・スキーマの基盤が存在

**Medium Risk要素**:
1. **動的フォーム配列のUX**: `useFieldArray`による100行テーブルのパフォーマンス懸念 → useMemoでの最適化で対応可
2. **複合用途モード切り替え**: UI状態管理の複雑さ → React Hook Formのwatchで制御可
3. **エラーメッセージの日本語化**: Zodのカスタマイズパターン調査必要 → 公式ドキュメント参照で対応可

**Low Risk要素**:
- 型安全性: TypeScript strict mode既存設定
- バリデーションロジック: Zodスキーマ部分実装済み
- デザインシステム: Tailwind CSS導入済み

---

## 6. Requirement-to-Asset Map

| Requirement | 必要な資産 | 既存資産 | ギャップ | 制約 |
|-------------|-----------|---------|---------|------|
| **Req 1: 用途コード選択** | ドロップダウンUI、グループ化ロジック | `USAGE_TYPES`, `UsageCode`型 | UIコンポーネント | なし |
| **Req 2: 基本属性入力** | 数値入力UI、バリデーション | `buildingInfoFormSchema` | 入力コンポーネント | なし |
| **Req 3: 階別用途詳細** | 動的テーブルUI、自動計算 | `FloorUsageDetail`型 | Zodスキーマ、UIロジック | パフォーマンス(100行) |
| **Req 4: 特殊属性入力** | チェックボックスUI、条件付き表示 | `BuildingInfo`型 | Zodスキーマ、条件ロジック | なし |
| **Req 5: バリデーション** | エラー表示UI、RHF統合 | 基本スキーマ | 包括スキーマ、エラーUI | なし |
| **Req 6: フォーム送信** | API Route、データ整形 | `RegulationJudge` | `/api/judge`、ハンドラー | なし |
| **Req 7: UIデザイン** | スタイリング、アイコン | Tailwind, lucide-react | コンポーネント実装 | なし |
| **Req 8: データ永続化** | localStorage統合 | なし | 保存/復元ロジック | localStorage容量 |

---

## 7. Recommendations for Design Phase

### 7.1 Preferred Approach

**Option B - Create New Components** を採用し、以下の方針で設計を進める:

1. **段階的実装**:
   - Phase 1: 基本UIコンポーネント(`ui/`) + 基本属性入力
   - Phase 2: 用途コード選択 + 単一用途モード
   - Phase 3: 複合用途モード(階別詳細テーブル)
   - Phase 4: 特殊属性 + バリデーション統合
   - Phase 5: API統合 + localStorage

2. **コンポーネント設計原則**:
   - **Single Responsibility**: 各コンポーネントは1つの責務に集中
   - **Type-Safe Props**: すべてのpropsをTypeScriptで厳密に定義
   - **Composition over Inheritance**: `ui/`コンポーネントを組み合わせて機能構築

3. **テスト戦略**:
   - 単体テスト: `ui/`コンポーネントをVitestでテスト
   - 統合テスト: `BuildingInputForm`のバリデーションフローをPlaywrightでテスト

### 7.2 Key Design Decisions Required

1. **複合用途入力のUI/UXパターン**:
   - タブ切り替え vs セクション展開 vs 完全別画面
   - 推奨: セクション展開(用途コード選択で動的表示)

2. **Zodスキーマ拡張方針**:
   - `buildingInfoFormSchema`に`FloorUsageDetail[]`スキーマを追加
   - 特殊属性のオプショナルフィールド検証追加

3. **エラー表示デザイン**:
   - インラインエラー(フィールド下) + トップレベルサマリー
   - lucide-reactの`AlertCircle`アイコン使用

4. **localStorage保存タイミング**:
   - 推奨: `onChange`でdebounce(500ms)付き自動保存

### 7.3 Research Items to Carry Forward

設計フェーズで調査・検証が必要な項目:

1. **React Hook Form useFieldArray の100行パフォーマンス検証** (Priority: High)
2. **Zod日本語エラーメッセージカスタマイズ実装** (Priority: High)
3. **Next.js 16 App Router POST API実装サンプル** (Priority: Medium)
4. **localStorage容量制限とフォールバック戦略** (Priority: Low)

---

## 8. Constraints & Assumptions

### Constraints
- **ブラウザ互換性**: Chrome/Firefox/Edge/Safari 100+ (モダンブラウザのみ)
- **画面サイズ**: 最小幅768px (タブレット以上)
- **パフォーマンス**: バリデーション100ms以内、100行テーブル対応

### Assumptions
- 消防職員はPCまたはタブレットで操作(スマートフォン非対応)
- インターネット接続あり(オフラインモード不要)
- ブラウザのlocalStorageが有効

---

_generated_at: 2025-11-09_
