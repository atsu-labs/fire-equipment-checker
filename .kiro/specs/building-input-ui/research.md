# Research & Design Decisions

---
**Purpose**: Capture discovery findings, architectural investigations, and rationale that inform the technical design.
---

## Summary
- **Feature**: `building-input-ui`
- **Discovery Scope**: Extension (新規UIコンポーネントを既存システムに追加)
- **Key Findings**:
  - React Hook Form 7.66.0 + Zod Resolver 統合パターンは標準化されており、`@hookform/resolvers/zod`を使用
  - `useFieldArray`により動的テーブル(階別用途詳細)を型安全に管理可能
  - 既存の型定義(`BuildingInfo`, `FloorUsageDetail`)とZodスキーマの拡張が必要
  - Next.js 16 App Routerでのフォーム送信は`app/page.tsx` → `app/api/judge/route.ts`パターン

## Research Log

### React Hook Form + Zod 統合パターン
- **Context**: バリデーションをZodスキーマで実施し、React Hook Formで管理する必要がある
- **Sources Consulted**:
  - https://react-hook-form.com/get-started#SchemaValidation
  - https://github.com/react-hook-form/resolvers
- **Findings**:
  - `@hookform/resolvers/zod`パッケージを使用してZodスキーマをReact Hook Formに統合
  - `useForm({ resolver: zodResolver(schema) })`でスキーマベースバリデーション有効化
  - `formState.errors`に型安全なエラーオブジェクトが格納される
  - `mode: 'onBlur'`オプションでフォーカスアウト時バリデーション実現
- **Implications**:
  - `lib/regulations/utils/schemas.ts`に`FloorUsageDetail[]`および特殊属性のZodスキーマ追加が必要
  - エラーメッセージの日本語化はZodスキーマの`.message()`オプションで実現可能

### useFieldArray による動的テーブル管理
- **Context**: 階別用途詳細入力テーブルで行の追加/削除を型安全に実装
- **Sources Consulted**:
  - https://react-hook-form.com/docs/usefieldarray
- **Findings**:
  - `useFieldArray({ control, name: 'floorUsageDetails' })`で動的配列管理
  - `fields, append, remove, insert`メソッドでテーブル操作
  - 各フィールドに自動生成される`id`をReact keyとして使用
  - バリデーションは配列全体・個別要素の両方で実行可能
- **Implications**:
  - `FloorUsageDetail[]`のZodスキーマは`z.array(floorUsageDetailSchema)`として定義
  - 各行のエラーは`errors.floorUsageDetails?.[index]?.field`でアクセス
  - パフォーマンス: 100行程度の配列でもReact Hook Formは最適化済み(公式ベンチマーク確認済み)

### localStorage 統合パターン
- **Context**: 入力途中のデータを自動保存し、ページリロード時に復元
- **Sources Consulted**: プロジェクト標準パターン調査(既存コードベース)
- **Findings**:
  - Next.js App Routerでは`useEffect`でlocalStorageアクセス(クライアントサイドのみ)
  - React Hook Formの`watch()`で全フォーム値を監視
  - `lodash.debounce`または`useMemo`でdebounce処理(500ms推奨)
  - 復元時は`reset()`メソッドでフォーム全体を初期化
- **Implications**:
  - `useEffect(() => { localStorage.setItem('building-form', JSON.stringify(watch())); }, [watch()])`パターン
  - セキュリティ: localStorageはXSS脆弱な場合データ流出リスク → 機密情報(個人情報)は保存しない設計
  - 容量: localStorage上限5MB、建築物情報は数KB程度で問題なし

### Next.js 16 App Router API Route パターン
- **Context**: `/api/judge`エンドポイントで規制判別を実行
- **Sources Consulted**: Next.js 16公式ドキュメント、既存プロジェクト構造
- **Findings**:
  - `app/api/judge/route.ts`にPOSTハンドラーを実装
  - `export async function POST(request: Request)`でリクエスト受信
  - `request.json()`でBodyをパース、Zodスキーマで検証
  - `RegulationJudge`クラスはサーバーサイドで実行(クライアント送信なし)
  - レスポンスは`NextResponse.json()`で返却
- **Implications**:
  - `lib/regulations/engine/regulation-judge.ts`のインポートと実行をAPI Routeで実施
  - エラーハンドリング: バリデーションエラー(400), サーバーエラー(500)の区別

### 既存型定義・スキーマの拡張方針
- **Context**: `BuildingInfo`型の全属性をカバーするZodスキーマが必要
- **Findings**:
  - 現状の`buildingInfoFormSchema`は基本属性のみ対応
  - `FloorUsageDetail`, 特殊属性, 構造情報等の拡張が必要
  - 全属性をオプショナルにするのではなく、必須/任意を明確に定義
- **Implications**:
  - `lib/regulations/utils/schemas.ts`に以下を追加:
    - `floorUsageDetailSchema`: 階別詳細のスキーマ
    - `buildingInfoFormSchemaExtended`: 全属性を含む包括的スキーマ
  - 段階的実装: Phase 1で基本属性、Phase 3で階別詳細、Phase 4で特殊属性

## Architecture Pattern Evaluation

| Option | Description | Strengths | Risks / Limitations | Notes |
|--------|-------------|-----------|---------------------|-------|
| 単一フォームコンポーネント | `BuildingInputForm`に全ロジック集約 | シンプル、状態管理が一元化 | 肥大化リスク、テストが困難 | 要件の複雑さから非推奨 |
| セクション分割 | 基本属性/階別詳細/特殊属性をセクションコンポーネントに分離 | 責任分離、並行実装可能、テスト容易 | コンポーネント間のprops設計が必要 | **採用** - ステアリング原則に準拠 |
| ページ分割 | 各セクションを別ページ(ウィザード形式)に分離 | 各画面がシンプル、段階的入力 | ページ遷移のUX複雑化、状態永続化必須 | 要件外(単一ページ要件あり) |

## Design Decisions

### Decision: セクション分割アーキテクチャの採用
- **Context**: 8つの要件を1つのフォームコンポーネントで実装するとコードが肥大化し保守性が低下
- **Alternatives Considered**:
  1. 単一フォームコンポーネント - すべてのロジックを`BuildingInputForm`に集約
  2. セクション分割 - 機能ごとにセクションコンポーネントを作成
  3. ページ分割 - ウィザード形式で複数ページに分割
- **Selected Approach**: セクション分割アーキテクチャ
  - `BuildingInputForm`: フォーム全体のオーケストレーション、React Hook Form管理
  - `UsageCodeSelect`: 用途コード選択セクション
  - `BasicAttributesSection`: 基本属性入力セクション
  - `FloorUsageTable`: 階別用途詳細テーブル(複合用途時のみ表示)
  - `SpecialAttributesSection`: 特殊属性入力セクション
- **Rationale**:
  - 単一責任原則に準拠(ステアリング原則)
  - コンポーネント間の並行実装が可能(チーム開発に最適)
  - Vitestでセクション単位のテストが容易
  - React Hook Formの`control`をpropsで渡すことで状態を共有
- **Trade-offs**:
  - ✅ 保守性向上、テスト容易性、並行開発可能
  - ❌ コンポーネント数増加(10-15ファイル)、props設計が必要
- **Follow-up**: セクション間のprops型定義を厳密に行い、TypeScript strict modeで検証

### Decision: Zodスキーマの段階的拡張
- **Context**: `BuildingInfo`型は非常に包括的(50+属性)だが、初期実装で全属性が必要なわけではない
- **Alternatives Considered**:
  1. 全属性スキーマを一度に実装
  2. 段階的に必要な属性のみスキーマ追加
- **Selected Approach**: 段階的拡張
  - Phase 1: 基本属性(`usageCode`, `totalArea`, `floors`, `undergroundFloors`)
  - Phase 3: 階別詳細(`floorUsageDetails`)
  - Phase 4: 特殊属性(`isWindowless`, `directStairCount`等)
- **Rationale**:
  - 要件の優先度に沿った実装(Req 1,2 → Req 3 → Req 4)
  - スキーマ定義の誤りを早期発見しやすい
  - テストも段階的に追加可能
- **Trade-offs**:
  - ✅ リスク分散、段階的検証
  - ❌ スキーマファイルへの複数回変更
- **Follow-up**: 最終的に`buildingInfoFormSchemaFull`として統合スキーマを作成

### Decision: localStorage自動保存のdebounce戦略
- **Context**: すべての入力onChange時にlocalStorage保存すると過度なI/O発生
- **Alternatives Considered**:
  1. onChange毎に即座に保存
  2. debounce(500ms)での自動保存
  3. 手動保存ボタン
- **Selected Approach**: debounce(500ms)自動保存
- **Rationale**:
  - UX: ユーザーが保存を意識する必要なし
  - パフォーマンス: 500ms以内の連続入力は1回の保存に集約
  - React Hook Formの`watch()`と`useEffect`で実装容易
- **Trade-offs**:
  - ✅ 自動保存でデータ損失防止、パフォーマンス最適化
  - ❌ 500ms以内のブラウザクラッシュでデータ損失リスク(極めて低確率)
- **Follow-up**: カスタムフック`useLocalStorageForm`として抽象化し再利用可能に

### Decision: 複合用途モード切り替えのUI表示パターン
- **Context**: 用途コードが(16)項(複合用途)の場合、階別詳細テーブルを表示
- **Alternatives Considered**:
  1. タブ切り替え(基本/詳細)
  2. セクション動的表示(選択時に展開)
  3. 別ページ遷移
- **Selected Approach**: セクション動的表示
- **Rationale**:
  - React Hook Formの`watch('usageCode')`で選択値を監視
  - 条件付きレンダリング(`{usageCode === '16-i' && <FloorUsageTable />}`)
  - 単一ページ内で完結(要件準拠)
- **Trade-offs**:
  - ✅ シンプルな実装、UX直感的
  - ❌ フォームが縦に長くなる(スクロール必要)
- **Follow-up**: スクロール位置自動調整(`scrollIntoView`)を検討

## Risks & Mitigations

### Risk 1: React Hook Form useFieldArray の100行パフォーマンス
- **Risk**: 階別詳細テーブルに100行追加時の操作遅延
- **Mitigation**:
  - React Hook Formは最適化済み(公式ベンチマーク確認)
  - 自動計算ロジックを`useMemo`でメモ化
  - 必要に応じて仮想スクロール(react-window)を後付け可能
- **Priority**: Medium(実装後パフォーマンステストで検証)

### Risk 2: Zodエラーメッセージの日本語化漏れ
- **Risk**: 一部のバリデーションエラーが英語表示される
- **Mitigation**:
  - 全Zodスキーマに`.message("日本語メッセージ")`を明示的に設定
  - カスタムエラーマップ(`z.setErrorMap`)でデフォルトメッセージを日本語化
- **Priority**: High(初期実装時に実施)

### Risk 3: localStorage容量制限
- **Risk**: 建築物情報のJSON文字列が5MBを超える
- **Mitigation**:
  - 通常の建築物情報は10-50KB程度で問題なし
  - 念のため`try-catch`でlocalStorage保存エラーをハンドリング
  - エラー時はメモリ内のみで保持(ページリロードで消失を警告)
- **Priority**: Low(発生確率極めて低い)

### Risk 4: APIエンドポイントのエラーハンドリング不足
- **Risk**: 規制判別エンジンの実行エラーが適切に処理されない
- **Mitigation**:
  - `try-catch`で`RegulationJudge`実行をラップ
  - バリデーションエラー(400), ビジネスロジックエラー(422), サーバーエラー(500)を区別
  - エラーレスポンスに詳細メッセージを含める
- **Priority**: High(API実装時に必須)

## References

- [React Hook Form - Get Started](https://react-hook-form.com/get-started) - 基本的な使用方法
- [React Hook Form - useFieldArray](https://react-hook-form.com/docs/usefieldarray) - 動的配列管理
- [@hookform/resolvers](https://github.com/react-hook-form/resolvers) - Zodリゾルバー統合
- [Zod Documentation](https://zod.dev) - スキーマ定義とバリデーション
- [Next.js 16 Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers) - API Route実装
- プロジェクトステアリング: `.kiro/steering/structure.md`, `.kiro/steering/tech.md` - アーキテクチャ原則

---

_generated_at: 2025-11-09_
