# Requirements Document

## Project Description (Input)
UIを作成する

## Introduction
消防用設備規制判別システムの建築物情報入力UIを構築する。消防職員が建築物の用途・面積・階数等の情報を入力し、バリデーション結果を即座に確認できるインターフェースを提供する。入力データは規制判別エンジン(`lib/regulations/engine`)に渡され、必要な消防設備が算出される。

## Requirements

### Requirement 1: 用途コード選択機能
**Objective:** 消防職員として、消防法施行令別表第一の47用途コードから建築物の用途を正確に選択できるようにし、誤入力を防止する

#### Acceptance Criteria
1. When ユーザーが用途選択フィールドをクリックする, the 建築物入力フォーム shall 47種類の用途コード(`UsageCode`)のドロップダウンリストを表示する
2. When ユーザーが用途コードを選択する, the 建築物入力フォーム shall 用途名と法令参照(例: "(一)項イ 劇場、映画館等")を併記して表示する
3. The 建築物入力フォーム shall 用途コードをカテゴリ別(一項、二項、三項等)にグループ化して表示する
4. When ユーザーが複合用途建築物((16)項)を選択する, the 建築物入力フォーム shall 複数用途の入力インターフェースに切り替える
5. The 建築物入力フォーム shall 選択された用途コードをTypeScriptリテラル型(`UsageCode`)として型安全に保持する

### Requirement 2: 基本属性入力機能
**Objective:** 消防職員として、延床面積・階数等の基本的な建築物属性を数値入力できるようにし、リアルタイムバリデーションで入力ミスを防ぐ

#### Acceptance Criteria
1. The 建築物入力フォーム shall 延床面積(㎡)、階数、地階数の数値入力フィールドを提供する
2. When ユーザーが数値フィールドに非数値を入力する, the 建築物入力フォーム shall エラーメッセージを即座に表示する
3. When ユーザーが負の数値を入力する, the 建築物入力フォーム shall "正の数値を入力してください"というエラーメッセージを表示する
4. The 建築物入力フォーム shall 数値入力フィールドに単位(㎡、階)を明示的に表示する
5. When ユーザーが延床面積に小数を入力する, the 建築物入力フォーム shall 小数第2位まで受け付ける

### Requirement 3: 階別用途詳細入力機能(複合用途対応)
**Objective:** 消防職員として、複合用途建築物の場合に階ごと×用途ごとの詳細情報を入力できるようにし、令第9条の複合用途みなし規定に対応する

#### Acceptance Criteria
1. When ユーザーが複合用途建築物を選択する, the 建築物入力フォーム shall 階別用途詳細入力テーブル(`FloorUsageDetail[]`)を表示する
2. The 建築物入力フォーム shall 各行に階数、用途コード、床面積、収容人員の入力フィールドを提供する
3. When ユーザーが"行を追加"ボタンをクリックする, the 建築物入力フォーム shall 新しい階×用途の入力行を追加する
4. When ユーザーが同一階に複数用途を入力する, the 建築物入力フォーム shall 階全体の属性(無窓階、避難階等)を共通設定として管理する
5. The 建築物入力フォーム shall 地階の階数を負の数(-1, -2等)として入力できるようにする
6. When ユーザーが階別詳細を入力する, the 建築物入力フォーム shall 用途別の床面積合計を自動計算して表示する

### Requirement 4: 特殊属性入力機能
**Objective:** 消防職員として、無窓階・避難階・階段数等の特殊な建築物属性を入力できるようにし、複雑な法令条件の判定に必要な情報を提供する

#### Acceptance Criteria
1. The 建築物入力フォーム shall 各階について無窓階フラグ(`isWindowless`)のチェックボックスを提供する
2. The 建築物入力フォーム shall 避難階フラグ(`isEvacuationFloor`)のチェックボックスを提供する
3. When ユーザーが階数を3階以上に設定する, the 建築物入力フォーム shall 直通階段数(`directStairCount`)の入力フィールドを表示する
4. The 建築物入力フォーム shall 避難上有効な屋外階段有無(`hasEffectiveOutdoorStair`)のチェックボックスを提供する
5. The 建築物入力フォーム shall 防火壁区画有無(`hasFirewallSeparation`)のチェックボックスを提供する

### Requirement 5: バリデーション機能
**Objective:** 消防職員として、入力データの妥当性をリアルタイムで確認できるようにし、規制判別エンジンへの無効なデータ送信を防止する

#### Acceptance Criteria
1. The 建築物入力フォーム shall Zodスキーマ(`BuildingInfo`)を使用してすべての入力値を検証する
2. When ユーザーが必須フィールドを空欄にする, the 建築物入力フォーム shall "必須項目です"というエラーメッセージをフィールド下部に表示する
3. When バリデーションエラーが存在する, the 建築物入力フォーム shall 判定実行ボタンを非活性化する
4. When すべての入力が有効になる, the 建築物入力フォーム shall 判定実行ボタンを活性化する
5. The 建築物入力フォーム shall React Hook Formの`formState.errors`を使用してエラー状態を管理する
6. When ユーザーがフィールドからフォーカスアウトする, the 建築物入力フォーム shall そのフィールドのバリデーションを即座に実行する

### Requirement 6: フォーム送信機能
**Objective:** 消防職員として、入力完了後に判定を実行できるようにし、規制判別エンジンに建築物情報を送信する

#### Acceptance Criteria
1. When ユーザーが判定実行ボタンをクリックする, the 建築物入力フォーム shall 入力データを`BuildingInfo`型として整形する
2. When フォーム送信が成功する, the 建築物入力フォーム shall `/api/judge` エンドポイントに建築物情報をPOSTリクエストで送信する
3. If フォーム送信中にネットワークエラーが発生する, then the 建築物入力フォーム shall "通信エラーが発生しました"というエラーメッセージを表示する
4. While フォーム送信中である, the 建築物入力フォーム shall 判定実行ボタンにローディングインジケーターを表示する
5. When フォーム送信が完了する, the 建築物入力フォーム shall 判定結果表示画面に遷移する

### Requirement 7: UIデザイン・アクセシビリティ
**Objective:** 消防職員として、直感的で使いやすいインターフェースを利用し、業務効率を向上させる

#### Acceptance Criteria
1. The 建築物入力フォーム shall Tailwind CSSを使用して消防業務に適した視認性の高いデザインを実装する
2. The 建築物入力フォーム shall 各入力フィールドに明確なラベルと補足説明(ツールチップまたはヘルプテキスト)を表示する
3. The 建築物入力フォーム shall lucide-reactアイコンを使用して操作ボタンを視覚的に識別しやすくする
4. The 建築物入力フォーム shall レスポンシブデザインでタブレット・デスクトップ両方で使用可能にする
5. When ユーザーがキーボード操作でフォームを操作する, the 建築物入力フォーム shall Tab/Enter/Escapeキーによる操作に対応する
6. The 建築物入力フォーム shall エラーメッセージを赤色で強調表示し、成功状態を緑色で表示する

### Requirement 8: データ永続化・入力リセット機能
**Objective:** 消防職員として、入力途中のデータを保持し、必要に応じて入力内容をリセットできるようにする

#### Acceptance Criteria
1. When ユーザーがフォームに入力する, the 建築物入力フォーム shall 入力内容をブラウザのlocalStorageに自動保存する
2. When ユーザーがページをリロードする, the 建築物入力フォーム shall localStorageから入力内容を復元する
3. When ユーザーが"入力内容をクリア"ボタンをクリックする, the 建築物入力フォーム shall すべての入力フィールドを初期状態にリセットする
4. When 入力内容をクリアする, the 建築物入力フォーム shall 確認ダイアログ"入力内容を削除しますか?"を表示する
5. When ユーザーが確認ダイアログで"はい"を選択する, the 建築物入力フォーム shall localStorageのデータを削除する

---

## Non-Functional Requirements

### Performance
- The 建築物入力フォーム shall フィールドのバリデーション結果を100ms以内に表示する
- The 建築物入力フォーム shall 階別用途詳細テーブルに100行追加しても操作が遅延しないようにする

### Compatibility
- The 建築物入力フォーム shall Chrome 100+、Firefox 100+、Edge 100+、Safari 15+で動作する
- The 建築物入力フォーム shall 画面幅768px以上のデバイスで最適表示する

### Type Safety
- The 建築物入力フォーム shall すべての入力データをTypeScript strict modeで型安全に管理する
- The 建築物入力フォーム shall `BuildingInfo`, `UsageCode`, `FloorUsageDetail`型を正確に使用する

---

_generated_at: 2025-11-09_

