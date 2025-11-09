# 消防設備判定に必要な建築物属性の洗い出し

## 目的
消防法施行令別表第一の各条文を分析し、基本的な面積・階数以外に必要な建築物属性を特定する。

## 分析対象条文
- 第9条、第9条の2（防火対象物の部分のみなし規定）★NEW
- 第10条（消火器具）
- 第11条（屋内消火栓設備）
- 第12条（スプリンクラー設備）
- 第13条（水噴霧消火設備等）★NEW
- 第19条（屋外消火栓設備）
- 第21条（自動火災報知設備）
- 第21条の2（ガス漏れ火災警報設備）
- 第22条（漏電火災警報器）
- 第23条（消防機関へ通報する火災報知設備）
- 第24条（非常警報器具又は非常警報設備）
- 第25条（避難器具）
- 第26条（誘導灯及び誘導標識）
- 第27条（消防用水）
- 第28条（排煙設備）
- 第28条の2（連結散水設備）
- 第29条（連結送水管）
- 第29条の2（非常コンセント設備）
- 第29条の3（無線通信補助設備）

---

## 必要な建築物属性の分類

### 1. 基本属性（既存）
- **用途コード** (UsageCode): 別表第一の用途分類
- **延床面積** (totalArea): 建築物全体の延床面積
- **階数** (floors): 地階を除く階数
- **地階数** (undergroundFloors): 地階の階数

---

### 2. 面積関連の詳細属性

#### 2.1 階×用途のマトリクス構造（複合用途対応）★重要変更

令第9条により、(16)項の複合用途建築物は各用途を独立した防火対象物とみなすため、
**階ごと×用途ごと**の詳細情報が必要。

```typescript
/**
 * 階×用途の詳細情報（マトリクス構造）
 * 複合用途建築物の場合、同一階に複数の用途が存在する可能性がある
 */
export interface FloorUsageDetail {
  floor: number;                    // 階数（地階は負の数：-1, -2, ...）
  usageCode: UsageCode;             // 用途コード
  area: number;                     // その階・その用途の床面積（㎡）
  capacity?: number;                // その階・その用途の収容人員
  
  // 以下は階全体の属性（同一階の複数用途で共通）
  isWindowless?: boolean;           // 無窓階かどうか
  isEvacuationFloor?: boolean;      // 避難階かどうか
  directStairCount?: number;        // 避難階又は地上に直通する階段の数
  hasEffectiveOutdoorStair?: boolean; // 総務省令で定める避難上有効な構造の屋外階段あり
  hasFirewallSeparation?: boolean;  // 避難上有効な開口部を有しない壁で区画あり
}

// BuildingInfoに追加
floorUsageDetails?: FloorUsageDetail[];
```

**データ構造の例:**
```typescript
// 複合用途建築物（(16)項）の場合
floorUsageDetails: [
  { floor: -1, usageCode: '4', area: 150, capacity: 30, isWindowless: false },
  { floor: -1, usageCode: '6-ro-1', area: 150, capacity: 40, isWindowless: false },
  { floor: 1, usageCode: '4', area: 200, capacity: 50, isEvacuationFloor: true },
  { floor: 1, usageCode: '6-ro-1', area: 200, capacity: 60, isEvacuationFloor: true },
  { floor: 2, usageCode: '6-ro-1', area: 400, capacity: 100, directStairCount: 2 },
  { floor: 3, usageCode: '6-ro-1', area: 400, capacity: 100, isWindowless: true, directStairCount: 2 },
]

// 単一用途建築物の場合（後方互換性のため従来通りでも可）
floorUsageDetails: [
  { floor: 1, usageCode: '6-ro-1', area: 400, isEvacuationFloor: true },
  { floor: 2, usageCode: '6-ro-1', area: 400, directStairCount: 2 },
  { floor: 3, usageCode: '6-ro-1', area: 400, directStairCount: 2 },
]
```

**必要な理由:**
- 第9条: (16)項の各用途を独立した防火対象物とみなす
- 第10条5号: 地階、無窓階、3階以上の階で床面積50㎡以上
- 第11条6号: 地階、無窓階、4階以上の階で床面積が用途により異なる基準
- 第12条11号: 地階、無窓階、4階以上10階以下の階で床面積基準
- 第21条10号: 地階又は無窓階で床面積100㎡以上（用途別に判定）
- 第21条11号: 地階、無窓階、3階以上の階で床面積300㎡以上（用途別に判定）
- 第25条: 各階ごとの収容人員判定（用途別）

#### 2.3 特定部分の面積・用途情報

`floorUsageDetails`から自動計算される用途別の集計情報。
判定ロジックで使用するため、ヘルパー関数で計算する。

```typescript
/**
 * 用途ごとの集計情報
 * floorUsageDetailsから自動計算される
 */
export interface UsageSummary {
  usageCode: UsageCode;             // 用途コード
  totalArea: number;                // その用途の床面積合計（全階）
  totalCapacity?: number;           // その用途の収容人員合計（全階）
  floors: number[];                 // その用途が存在する階のリスト
  
  // 地階・無窓階・特定階の面積（用途ごと）
  basementArea?: number;            // 地階の面積合計
  basementFloors?: number[];        // 地階のリスト
  windowlessArea?: number;          // 無窓階の面積合計
  windowlessFloors?: number[];      // 無窓階のリスト
  floor3AndAboveArea?: number;      // 3階以上の面積合計
  floor4AndAboveArea?: number;      // 4階以上の面積合計
  floor4To10Area?: number;          // 4階以上10階以下の面積合計
  floor11AndAboveArea?: number;     // 11階以上の面積合計
  
  // 収容人員の階別集計
  floorCapacities?: {
    floor: number;
    capacity: number;
  }[];
}

/**
 * floorUsageDetailsから用途ごとの集計情報を計算
 */
export function calculateUsageSummaries(
  floorUsageDetails: FloorUsageDetail[]
): UsageSummary[] {
  const usageMap = new Map<UsageCode, UsageSummary>();

  for (const detail of floorUsageDetails) {
    if (!usageMap.has(detail.usageCode)) {
      usageMap.set(detail.usageCode, {
        usageCode: detail.usageCode,
        totalArea: 0,
        totalCapacity: 0,
        floors: [],
        basementArea: 0,
        basementFloors: [],
        windowlessArea: 0,
        windowlessFloors: [],
        floor3AndAboveArea: 0,
        floor4AndAboveArea: 0,
        floor4To10Area: 0,
        floor11AndAboveArea: 0,
        floorCapacities: [],
      });
    }

    const summary = usageMap.get(detail.usageCode)!;
    
    // 総面積・総収容人員
    summary.totalArea += detail.area;
    summary.totalCapacity = (summary.totalCapacity || 0) + (detail.capacity || 0);
    
    // 階リスト
    if (!summary.floors.includes(detail.floor)) {
      summary.floors.push(detail.floor);
    }

    // 地階判定（floor < 0）
    if (detail.floor < 0) {
      summary.basementArea = (summary.basementArea || 0) + detail.area;
      if (!summary.basementFloors?.includes(detail.floor)) {
        summary.basementFloors?.push(detail.floor);
      }
    }
    
    // 無窓階判定
    if (detail.isWindowless) {
      summary.windowlessArea = (summary.windowlessArea || 0) + detail.area;
      if (!summary.windowlessFloors?.includes(detail.floor)) {
        summary.windowlessFloors?.push(detail.floor);
      }
    }
    
    // 特定階の判定
    if (detail.floor >= 3) {
      summary.floor3AndAboveArea = (summary.floor3AndAboveArea || 0) + detail.area;
    }
    if (detail.floor >= 4) {
      summary.floor4AndAboveArea = (summary.floor4AndAboveArea || 0) + detail.area;
    }
    if (detail.floor >= 4 && detail.floor <= 10) {
      summary.floor4To10Area = (summary.floor4To10Area || 0) + detail.area;
    }
    if (detail.floor >= 11) {
      summary.floor11AndAboveArea = (summary.floor11AndAboveArea || 0) + detail.area;
    }

    // 収容人員の階別集計
    if (detail.capacity) {
      const existing = summary.floorCapacities?.find(fc => fc.floor === detail.floor);
      if (existing) {
        existing.capacity += detail.capacity;
      } else {
        summary.floorCapacities?.push({ 
          floor: detail.floor, 
          capacity: detail.capacity 
        });
      }
    }
  }

  return Array.from(usageMap.values());
}

/**
 * 階ごとの集計情報を取得
 */
export interface FloorSummary {
  floor: number;
  totalArea: number;                // その階の総面積（全用途合計）
  totalCapacity?: number;           // その階の総収容人員（全用途合計）
  usages: UsageCode[];              // その階に存在する用途のリスト
  isWindowless?: boolean;
  isEvacuationFloor?: boolean;
  directStairCount?: number;
}

export function calculateFloorSummaries(
  floorUsageDetails: FloorUsageDetail[]
): FloorSummary[] {
  const floorMap = new Map<number, FloorSummary>();

  for (const detail of floorUsageDetails) {
    if (!floorMap.has(detail.floor)) {
      floorMap.set(detail.floor, {
        floor: detail.floor,
        totalArea: 0,
        totalCapacity: 0,
        usages: [],
        isWindowless: detail.isWindowless,
        isEvacuationFloor: detail.isEvacuationFloor,
        directStairCount: detail.directStairCount,
      });
    }

    const summary = floorMap.get(detail.floor)!;
    summary.totalArea += detail.area;
    summary.totalCapacity = (summary.totalCapacity || 0) + (detail.capacity || 0);
    
    if (!summary.usages.includes(detail.usageCode)) {
      summary.usages.push(detail.usageCode);
    }
  }

  return Array.from(floorMap.values()).sort((a, b) => a.floor - b.floor);
}
```

**必要な理由:**
- 令第9条: (16)項の各用途を独立した防火対象物とみなして判定
- 用途別の延床面積・地階面積・無窓階面積等で設備設置要否を判定
- 階ごとの合計面積・合計収容人員で判定する条項もある
```typescript
specificAreaInfo?: {
  stageArea?: number;              // 舞台部の床面積（㎡）- 第12条2号、第28条2号
  stageFloor?: number;             // 舞台部の所在階
  rackWarehouseCeilingHeight?: number; // ラック式倉庫の天井高さ（m）- 第12条5号
  
  // 道路用部分（車両交通用）- 第13条、第21条12号、第29条5号
  roadArea?: number;               // 道路の用に供される部分の床面積（㎡）
  roadFloor?: number;              // 道路部分の所在階（地階、1階、2階以上、屋上）
  roadIsRooftop?: boolean;         // 道路部分が屋上か
  roadIsVehicleTraffic?: boolean;  // 車両の交通用か（総務省令で定めるもの）★NEW
  
  // ヘリポート - 第13条★NEW
  heliportArea?: number;           // ヘリポートの床面積（㎡）
  heliportIsRooftop?: boolean;     // 屋上部分か
  
  // 駐車用部分 - 第13条、第21条13号
  parkingArea?: number;            // 駐車用部分の床面積（㎡）
  parkingFloor?: number;           // 駐車用部分の所在階
  parkingCanExitSimultaneously?: boolean; // 全車両同時に屋外退出可能か
  parkingIsMechanical?: boolean;   // 昇降機等の機械装置による駐車か★NEW
  parkingVehicleCapacity?: number; // 機械式駐車場の収容台数★NEW
  
  // 自動車修理・整備用部分 - 第13条★NEW
  autoRepairArea?: number;         // 自動車の修理又は整備用部分の床面積（㎡）
  autoRepairFloor?: number;        // 所在階
  
  // 電気設備室 - 第13条★NEW
  electricalEquipmentRoomArea?: number; // 発電機・変圧器等の電気設備室の床面積（㎡）
  
  // 多量火気使用部分 - 第13条★NEW
  highFireUseArea?: number;        // 鍛造場、ボイラー室、乾燥室等の床面積（㎡）
  
  // 通信機器室 - 第13条、第21条15号
  communicationRoomArea?: number;  // 通信機器室の床面積（㎡）
  
  basementTotalArea?: number;      // 地階の床面積合計（㎡）- 第21条の2、第28条の2
  firstFloorArea?: number;         // 1階の床面積（㎡）- 第19条
  secondFloorArea?: number;        // 2階の床面積（㎡）- 第19条
  siteArea?: number;               // 敷地面積（㎡）- 第27条
};
```

#### 2.4 複合用途建築物の用途別面積（従来の設計 - 非推奨）

**注: 2.1の階×用途マトリクス構造を使用することを推奨。**
**以下は後方互換性のため残すが、新規実装では使用しない。**

```typescript
// 非推奨: 階情報が失われるため詳細な判定ができない
usageSpecificAreas?: {
  usageCode: UsageCode;  // 該当用途コード
  totalArea: number;     // その用途に供される部分の床面積合計（㎡）
  floors?: number[];     // その用途が存在する階
}[];
```

**代わりに`floorUsageDetails`と`calculateUsageSummaries()`を使用:**
```typescript
// 推奨: 階×用途マトリクス → 用途別集計
const summaries = calculateUsageSummaries(building.floorUsageDetails || []);
const usage6ro1 = summaries.find(s => s.usageCode === '6-ro-1');
console.log(usage6ro1?.totalArea); // 用途別の総面積
console.log(usage6ro1?.basementArea); // 用途別の地階面積
```

---

### 3. 構造関連属性

#### 3.1 建築基準法上の構造分類
```typescript
structureType?: 
  | 'fireproof'           // 耐火建築物
  | 'quasi-fireproof'     // 準耐火建築物
  | 'other';              // その他
```
**必要な理由:**
- 第11条2項: 延床面積・床面積の緩和規定（耐火・準耐火）
- 第19条: 屋外消火栓の設置基準（耐火9000㎡、準耐火6000㎡、その他3000㎡）
- 第25条3号: 特定主要構造部を耐火構造とした建築物の2階を除く
- 第27条: 消防用水の床面積基準

#### 3.2 特定主要構造部・内装仕上げ
```typescript
structureDetails?: {
  specialMainStructureFireproof?: boolean;  // 特定主要構造部が耐火構造
  wallInteriorFinish?: 'incombustible' | 'quasi-incombustible' | 'flame-retardant' | 'other';
  ceilingInteriorFinish?: 'incombustible' | 'quasi-incombustible' | 'flame-retardant' | 'other';
  qualifiesForBCL2_9_3?: boolean; // 建築基準法2条9の3イ・ロ該当
};
```
**必要な理由:**
- 第11条2項: 延床面積の緩和（特定主要構造部耐火+内装難燃で3倍、その他条件で2倍）

#### 3.3 延焼抑制機能を備える構造
```typescript
hasFireSpreadSuppressionStructure?: boolean; // 火災発生時の延焼を抑制する機能を備える構造
```
**必要な理由:**
- 第12条1号: スプリンクラー設備の免除条件

#### 3.4 漏電火災警報器関連の構造
```typescript
hasWireNetConstruction?: boolean; // 鉄網入り壁・床・天井（準不燃材料以外）の有無
```
**必要な理由:**
- 第22条: 漏電火災警報器の設置要件

---

### 4. 収容人員

```typescript
capacity?: number;  // 収容人員（人）

// 階別収容人員
floorCapacities?: {
  floor: number;     // 階数
  capacity: number;  // その階の収容人員
}[];
```
**必要な理由:**
- 第21条の2第3号: 収容人員が総務省令で定める数以上
- 第24条: 非常警報器具（20人以上50人未満）、非常ベル等（20人以上、50人以上）
- 第24条3項: 収容人員300人以上、500人以上、800人以上
- 第25条: 避難器具の各号で収容人員10人、20人、30人、50人、100人、150人の基準

---

### 5. 階段関連

**注: 階段情報は`floorUsageDetails`の階全体属性として保持**

```typescript
// floorUsageDetails内に含まれる
interface FloorUsageDetail {
  // ...
  directStairCount?: number;         // 避難階又は地上に直通する階段の数
  hasEffectiveOutdoorStair?: boolean; // 総務省令で定める避難上有効な構造の屋外階段あり
  hasFirewallSeparation?: boolean;  // 避難上有効な開口部を有しない壁で区画あり
}
```

**使用例:**
```typescript
// 第21条7号: 避難階以外から避難階・地上へ直通する階段が2以上ない場合
function checkArticle21_7(building: BuildingInfo): boolean {
  const floorSummaries = calculateFloorSummaries(building.floorUsageDetails || []);
  
  for (const floorSummary of floorSummaries) {
    if (floorSummary.isEvacuationFloor) continue;
    
    // 階段数の判定
    const requiredStairs = floorSummary.hasEffectiveOutdoorStair ? 1 : 2;
    if ((floorSummary.directStairCount || 0) < requiredStairs) {
      // 該当用途が存在するか確認
      const hasTargetUsage = floorSummary.usages.some(u => 
        ['1-i', '1-ro', '2-i', '2-ro', '2-ha', '3-i', '3-ro', '4', 
         '5-i', '6-i-1', '6-i-2', /* ... */].includes(u)
      );
      
      if (hasTargetUsage) {
        return true;
      }
    }
  }
  
  return false;
}
```

**必要な理由:**
- 第21条7号: 避難階以外から避難階・地上へ直通する階段が2以上（条件により1以上）ない場合
- 第25条5号: 階段が2以上設けられていない階で収容人員10人以上

---

### 6. 建築物の高さ

```typescript
height?: number;  // 建築物の高さ（m）
```
**必要な理由:**
- 第27条2号: 高さ31mを超え、かつ延床面積25,000㎡以上

---

### 7. 危険物・指定可燃物

#### 7.1 少量危険物
```typescript
hazardousMaterials?: {
  hasMinorHazardous?: boolean;     // 少量危険物の貯蔵・取扱いあり
  designatedQuantityRatio?: number; // 指定数量に対する倍数（1/5以上1未満）
};
```
**必要な理由:**
- 第10条4号: 指定数量の1/5以上

#### 7.2 指定可燃物
```typescript
designatedCombustibles?: {
  hasCombustibles?: boolean;           // 指定可燃物の貯蔵・取扱いあり
  regulatedQuantityRatio?: number;     // 規制数量に対する倍数
  excludesFlammableLiquids?: boolean;  // 可燃性液体類を除く
  
  // 第13条で必要な詳細分類★NEW
  combustibleTypes?: {
    type: 'cotton-fiber' | 'wood-wool' | 'rags-paper' | 'thread' | 'straw' 
        | 'renewable-fuel' | 'synthetic-resin-rubber' | 'oil-soaked-rags-paper' 
        | 'coal-charcoal' | 'flammable-solid' | 'flammable-liquid' 
        | 'synthetic-resin-non-rubber' | 'wood-products';
    quantity: number;                  // 貯蔵・取扱い量
    regulatedQuantityRatio: number;    // 規制数量に対する倍数
  }[];
};
```
**必要な理由:**
- 第10条4号: 指定可燃物を貯蔵・取扱い
- 第11条5号: 指定可燃物（可燃性液体類除く）を750倍以上
- 第12条8号: 指定可燃物（可燃性液体類除く）を1000倍以上
- 第13条: 指定可燃物を1000倍以上貯蔵・取扱い（物品種類により設備が異なる）★NEW
- 第21条8号: 指定可燃物を500倍以上

---

### 8. 火使用設備

```typescript
hasFireUsingEquipment?: boolean;      // 火を使用する設備又は器具あり
fireUsingEquipmentHasSafety?: boolean; // 防火上有効な措置が講じられているか
```
**必要な理由:**
- 第10条1号ロ: (3)項で火を使用する設備又は器具を設けたもの（防火措置なし）

---

### 9. 温泉採取設備

```typescript
hasHotSpringEquipment?: boolean;       // 温泉採取設備あり
hotSpringEquipmentType?: string;       // 総務省令で定める温泉採取設備の種類
hasHotSpringLawConfirmation?: boolean; // 温泉法第14条の5第1項の確認を受けたか
```
**必要な理由:**
- 第21条の2第3号: 温泉採取設備が設置されているもの

---

### 10. 電気設備

```typescript
contractedCurrentCapacity?: number; // 契約電流容量（アンペア）
maxContractedCurrent?: number;      // 最大契約電流容量（複数契約種別の場合）
```
**必要な理由:**
- 第22条7号: 契約電流容量が50アンペアを超えるもの

---

### 11. 消防機関からの距離

```typescript
distanceFromFireStation?: 'normal' | 'significantly-far' | 'other'; // 消防機関からの距離
```
**必要な理由:**
- 第23条ただし書: 消防機関から著しく離れた場所等は除外

---

### 12. 避難関連

```typescript
evacuationInfo?: {
  hasEffectiveOpenings?: boolean;  // 避難上有効な開口部あり
  isEvacuationEasy?: boolean;      // 避難が容易であると認められる（総務省令）
};
```
**必要な理由:**
- 第26条ただし書: 避難が容易と認められるもの（総務省令）は誘導灯・誘導標識不要

---

### 13. 同一敷地内の複数建築物

```typescript
adjacentBuildings?: {
  buildingId: string;                    // 建築物ID
  floor1ExteriorWallDistance?: number;   // 1階外壁間中心線からの水平距離（m）
  floor2ExteriorWallDistance?: number;   // 2階外壁間中心線からの水平距離（m）
}[];
```
**必要な理由:**
- 第19条2項: 同一敷地内の建築物相互の距離（1階3m以下、2階5m以下）で一の建築物とみなす
- 第27条2項: 同様の距離基準で消防用水の算定

---

### 14. 道路用部分（トンネル等）

```typescript
hasRoadUsePortion?: boolean; // 道路の用に供される部分あり
```
**必要な理由:**
- 第21条12号: 道路の用に供される部分（屋上600㎡以上、それ以外400㎡以上）
- 第29条5号: 道路の用に供される部分を有するもの

---

### 15. 複合用途建築物・地下街のみなし規定（第9条・第9条の2）★NEW

#### 15.1 (16)項の部分のみなし
```typescript
section16PartTreatment?: {
  treatAsIndependentBuilding?: boolean; // 独立した防火対象物とみなすか
  applicableUsageCode: UsageCode;       // みなす用途コード
  excludedArticles?: string[];          // 除外される条項
};
```
**必要な理由:**
- 第9条: (16)項の部分を各用途の独立した防火対象物とみなす（一部条項除く）

#### 15.2 地下街との一体判定
```typescript
undergroundMallIntegration?: {
  isIntegratedWithUndergroundMall?: boolean; // (16-2)項地下街と一体を成すか
  designatedByFireChief?: boolean;           // 消防長・消防署長の指定を受けたか
  treatAsUndergroundMallPart?: boolean;      // (16-2)項の部分とみなすか
};
```
**必要な理由:**
- 第9条の2: (1)〜(4)項、(5)項イ、(6)項、(9)項イ、(16)項イの地階が(16-2)項地下街と一体を成す場合のみなし規定

---

### 16. 下階の用途（避難器具の収容人員判定）

**注: 階×用途マトリクスを使用することで自動判定可能**

```typescript
/**
 * 下階に特定用途が存在するかを判定
 * 第25条1号・2号: 下階に特定用途が存する場合、収容人員基準が変わる
 */
export function hasSpecificUsageInLowerFloors(
  building: BuildingInfo,
  targetFloor: number
): boolean {
  const specificUsages: UsageCode[] = [
    '1-i', '1-ro', '2-i', '2-ro', '2-ha', '3-i', '3-ro', '4',
    '9-i', '9-ro', '12-i', '13-i', '14', '15'
  ];

  const lowerFloorDetails = building.floorUsageDetails?.filter(
    d => d.floor < targetFloor
  ) || [];

  return lowerFloorDetails.some(d => specificUsages.includes(d.usageCode));
}
```

**使用例:**
```typescript
// 第25条1号: (6)項の2階以上又は地階で収容人員20人以上
// ただし下階に特定用途がある場合は10人以上
function checkArticle25_1(building: BuildingInfo): boolean {
  const floorSummaries = calculateFloorSummaries(building.floorUsageDetails || []);

  for (const floorSummary of floorSummaries) {
    // (6)項の用途が存在するか
    const has6Usage = floorSummary.usages.some(u => u.startsWith('6-'));
    if (!has6Usage) continue;

    // 2階以上または地階
    if (floorSummary.floor < -0 || floorSummary.floor >= 2) {
      const hasLowerSpecific = hasSpecificUsageInLowerFloors(building, floorSummary.floor);
      const threshold = hasLowerSpecific ? 10 : 20;
      
      if ((floorSummary.totalCapacity || 0) >= threshold) {
        return true;
      }
    }
  }

  return false;
}
```

**従来の設計（非推奨）:**
```typescript
// 非推奨: 階×用途マトリクスで自動判定できるため不要
lowerFloorUsages?: {
  floor: number;        // 下階の階数
  usageCodes: UsageCode[]; // 下階の用途コード
}[];
```

**必要な理由:**
- 第25条1号: 下階に特定用途が存する場合、収容人員20人→10人に変更
- 第25条2号: 下階に特定用途が存する場合、収容人員30人→10人に変更

---

## まとめ: 新たに必要な型定義

### 設備種別の追加（第13条対応）★NEW
```typescript
export type EquipmentType =
  | '消火器'
  | '屋内消火栓設備'
  | 'スプリンクラー設備'
  | '水噴霧消火設備'        // ★NEW
  | '泡消火設備'            // ★NEW
  | '不活性ガス消火設備'    // ★NEW
  | 'ハロゲン化物消火設備'  // ★NEW
  | '粉末消火設備'          // ★NEW
  | '屋外消火栓設備'        // 追記
  | '自動火災報知設備'
  | '避難器具'
  | '誘導灯'
  | '誘導標識'
  | '消防用水'
  | '排煙設備'
  | '連結送水管'
  | '連結散水設備'
  | '非常コンセント設備'
  | '無線通信補助設備'
  | 'ガス漏れ火災警報設備'
  | '漏電火災警報器'
  | '非常警報設備';         // 追記
```

### BuildingInfo型の拡張案

```typescript
export interface BuildingInfo {
  // === 既存の基本属性 ===
  usageCode: UsageCode;
  totalArea: number;
  floors: number;
  undergroundFloors: number;

  // === 階×用途マトリクス（最重要）===
  floorUsageDetails?: FloorUsageDetail[];

  // === 複合用途情報（非推奨 - floorUsageDetailsから自動計算すべき）===
  // usageSpecificAreas?: {...}; // 後方互換性のため残すが使用しない

  // === 構造情報 ===
  structureType?: 'fireproof' | 'quasi-fireproof' | 'other';
  structureDetails?: {
    specialMainStructureFireproof?: boolean;
    wallInteriorFinish?: 'incombustible' | 'quasi-incombustible' | 'flame-retardant' | 'other';
    ceilingInteriorFinish?: 'incombustible' | 'quasi-incombustible' | 'flame-retardant' | 'other';
    qualifiesForBCL2_9_3?: boolean;
  };
  hasFireSpreadSuppressionStructure?: boolean;
  hasWireNetConstruction?: boolean;

  // === 特定部分の面積・高さ情報 ===
  specificAreas?: {
    stageArea?: number;
    stageFloor?: number;
    rackWarehouseCeilingHeight?: number;
    
    // 道路用部分（車両交通用）★NEW
    roadArea?: number;
    roadFloor?: number;
    roadIsRooftop?: boolean;
    roadIsVehicleTraffic?: boolean;
    
    // ヘリポート★NEW
    heliportArea?: number;
    heliportIsRooftop?: boolean;
    
    // 駐車用部分
    parkingArea?: number;
    parkingFloor?: number;
    parkingCanExitSimultaneously?: boolean;
    parkingIsMechanical?: boolean;        // ★NEW
    parkingVehicleCapacity?: number;      // ★NEW
    
    // 自動車修理・整備用部分★NEW
    autoRepairArea?: number;
    autoRepairFloor?: number;
    
    // 電気設備室★NEW
    electricalEquipmentRoomArea?: number;
    
    // 多量火気使用部分★NEW
    highFireUseArea?: number;
    
    // 通信機器室
    communicationRoomArea?: number;
    
    basementTotalArea?: number;
    firstFloorArea?: number;
    secondFloorArea?: number;
    siteArea?: number;
  };

  // === 建築物高さ ===
  height?: number;

  // === 収容人員 ===
  capacity?: number;

  // === 危険物・指定可燃物 ===
  hazardousMaterials?: {
    hasMinorHazardous?: boolean;
    designatedQuantityRatio?: number;
  };
  designatedCombustibles?: {
    hasCombustibles?: boolean;
    regulatedQuantityRatio?: number;
    excludesFlammableLiquids?: boolean;
    // 第13条対応の詳細分類★NEW
    combustibleTypes?: {
      type: 'cotton-fiber' | 'wood-wool' | 'rags-paper' | 'thread' | 'straw' 
          | 'renewable-fuel' | 'synthetic-resin-rubber' | 'oil-soaked-rags-paper' 
          | 'coal-charcoal' | 'flammable-solid' | 'flammable-liquid' 
          | 'synthetic-resin-non-rubber' | 'wood-products';
      quantity: number;
      regulatedQuantityRatio: number;
    }[];
  };

  // === 火使用設備 ===
  hasFireUsingEquipment?: boolean;
  fireUsingEquipmentHasSafety?: boolean;

  // === 温泉採取設備 ===
  hasHotSpringEquipment?: boolean;
  hotSpringEquipmentType?: string;
  hasHotSpringLawConfirmation?: boolean;

  // === 電気設備 ===
  contractedCurrentCapacity?: number;
  maxContractedCurrent?: number;

  // === 避難関連 ===
  evacuationInfo?: {
    hasEffectiveOpenings?: boolean;
    isEvacuationEasy?: boolean;
  };

  // === 消防機関からの距離 ===
  distanceFromFireStation?: 'normal' | 'significantly-far' | 'other';

  // === 同一敷地内の複数建築物 ===
  adjacentBuildings?: {
    buildingId: string;
    floor1ExteriorWallDistance?: number;
    floor2ExteriorWallDistance?: number;
  }[];

  // === 道路用部分 ===
  hasRoadUsePortion?: boolean;
  
  // === 複合用途・地下街のみなし規定（第9条・第9条の2）★NEW ===
  section16PartTreatment?: {
    treatAsIndependentBuilding?: boolean;
    applicableUsageCode: UsageCode;
    excludedArticles?: string[];
  };
  undergroundMallIntegration?: {
    isIntegratedWithUndergroundMall?: boolean;
    designatedByFireChief?: boolean;
    treatAsUndergroundMallPart?: boolean;
  };
}
```

---

## 判定ロジックの実装パターン

### パターン1: 建築物全体での判定

用途に関わらず、建築物全体の属性で判定する場合。

```typescript
// 例: 第29条 - 地階を除く階数が7以上
function checkArticle29_1(building: BuildingInfo): boolean {
  return building.floors >= 7;
}

// 例: 第27条 - 高さ31mを超え、延床面積25,000㎡以上
function checkArticle27_2(building: BuildingInfo): boolean {
  return (building.height || 0) > 31 && building.totalArea >= 25000;
}
```

---

### パターン2: 用途ごとに独立した防火対象物として判定（令第9条）

(16)項の場合、各用途を独立した防火対象物とみなして判定。

```typescript
// 例: 第12条7号 - (16-3)項で特定用途の床面積合計が500㎡以上
function checkArticle12_7(building: BuildingInfo): boolean {
  if (building.usageCode !== '16-3') {
    return false; // (16-3)項以外は非該当
  }

  const summaries = calculateUsageSummaries(building.floorUsageDetails || []);
  const targetUsages: UsageCode[] = ['1-i', '1-ro', '2-i', '2-ro', '2-ha', 
    '3-i', '3-ro', '4', '5-i', '6-i-1', '6-i-2', '6-i-3', '6-i-4', 
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5', '6-ha-1', '6-ha-2', 
    '6-ha-3', '6-ha-4', '6-ha-5', '6-ni', '9-i'];

  for (const usage of targetUsages) {
    const summary = summaries.find(s => s.usageCode === usage);
    if (summary && summary.totalArea >= 500) {
      return true; // いずれかの用途で該当
    }
  }

  return false;
}
```

```typescript
// 例: 第11条2号 - 用途別に延床面積の基準が異なる
function checkArticle11_2(building: BuildingInfo): boolean {
  if (building.usageCode === '16-i') {
    // (16)項イの場合、各用途ごとに判定
    const summaries = calculateUsageSummaries(building.floorUsageDetails || []);
    
    for (const summary of summaries) {
      const threshold = getAreaThresholdForUsage(summary.usageCode);
      if (summary.totalArea >= threshold) {
        return true;
      }
    }
    return false;
  } else {
    // 単一用途の場合
    const threshold = getAreaThresholdForUsage(building.usageCode);
    return building.totalArea >= threshold;
  }
}

function getAreaThresholdForUsage(usageCode: UsageCode): number {
  if (['2-i', '2-ro', '2-ha', '3-i', '3-ro', '4', '5-i', '5-ro', 
       '6-i-1', '6-i-2', '6-i-3', '6-i-4', '6-ro-1', /* ... */].includes(usageCode)) {
    return 700; // 700㎡以上
  }
  if (['11', '15'].includes(usageCode)) {
    return 1000; // 1000㎡以上
  }
  // (1)項は500㎡
  return 500;
}
```

---

### パターン3: 階ごとの判定

特定の階（地階、無窓階、3階以上等）で判定する場合。

```typescript
// 例: 第21条11号 - 地階、無窓階、3階以上の階で床面積300㎡以上
function checkArticle21_11(building: BuildingInfo): boolean {
  const floorSummaries = calculateFloorSummaries(building.floorUsageDetails || []);

  for (const floorSummary of floorSummaries) {
    // 地階、無窓階、または3階以上
    const isTarget = 
      floorSummary.floor < 0 || 
      floorSummary.isWindowless || 
      floorSummary.floor >= 3;

    if (isTarget && floorSummary.totalArea >= 300) {
      return true;
    }
  }

  return false;
}
```

---

### パターン4: 階×用途の組み合わせ判定

特定の階にある特定の用途で判定する場合。

```typescript
// 例: 第12条11号イ - (1)(3)(5)イ(6)(9)イの階で床面積が基準以上
function checkArticle12_11_i(building: BuildingInfo): boolean {
  const targetUsages: UsageCode[] = ['1-i', '1-ro', '3-i', '3-ro', '5-i', 
    '6-i-1', '6-i-2', '6-i-3', '6-i-4', '6-ro-1', /* ... */, '9-i'];

  const details = building.floorUsageDetails || [];

  for (const detail of details) {
    // 対象用途でない場合はスキップ
    if (!targetUsages.includes(detail.usageCode)) continue;

    // 地階または無窓階
    if (detail.floor < 0 || detail.isWindowless) {
      if (detail.area >= 1000) return true;
    }

    // 4階以上10階以下
    if (detail.floor >= 4 && detail.floor <= 10) {
      if (detail.area >= 1500) return true;
    }
  }

  return false;
}
```

```typescript
// 例: 第25条1号 - (6)項の2階以上又は地階で収容人員基準以上
function checkArticle25_1(building: BuildingInfo): boolean {
  const details = building.floorUsageDetails || [];
  const usage6Codes = ['6-i-1', '6-i-2', '6-i-3', '6-i-4', 
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
    '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni'];

  for (const detail of details) {
    // (6)項でない場合はスキップ
    if (!usage6Codes.includes(detail.usageCode)) continue;

    // 2階以上または地階
    if (detail.floor >= 2 || detail.floor < 0) {
      // 下階に特定用途が存在するか確認
      const hasLowerSpecific = hasSpecificUsageInLowerFloors(building, detail.floor);
      const threshold = hasLowerSpecific ? 10 : 20;

      if ((detail.capacity || 0) >= threshold) {
        return true;
      }
    }
  }

  return false;
}
```

---

### パターン5: 用途ごとの特定階面積判定

用途別に地階・無窓階・特定階の面積を集計して判定する場合。

```typescript
// 例: 第21条10号 - (2)(3)(16)項イの地階・無窓階で床面積100㎡以上（用途別）
function checkArticle21_10(building: BuildingInfo): boolean {
  const targetUsages: UsageCode[] = ['2-i', '2-ro', '2-ha', '3-i', '3-ro', '16-i'];
  const summaries = calculateUsageSummaries(building.floorUsageDetails || []);

  for (const summary of summaries) {
    if (!targetUsages.includes(summary.usageCode)) continue;

    // 地階または無窓階の面積合計
    const targetArea = (summary.basementArea || 0) + (summary.windowlessArea || 0);

    if (targetArea >= 100) {
      return true;
    }
  }

  return false;
}
```

---

### パターン6: 後方互換性（単一用途建築物の簡易入力）

`floorUsageDetails`が未入力の場合、基本属性から自動生成。

```typescript
/**
 * 単一用途建築物の場合、基本属性からfloorUsageDetailsを生成
 */
export function ensureFloorUsageDetails(building: BuildingInfo): FloorUsageDetail[] {
  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    return building.floorUsageDetails;
  }

  // 簡易的な実装: 階別面積を均等に分割
  const avgFloorArea = building.totalArea / building.floors;
  const avgFloorCapacity = building.capacity 
    ? building.capacity / building.floors 
    : undefined;

  const details: FloorUsageDetail[] = [];

  // 地階
  for (let i = 1; i <= building.undergroundFloors; i++) {
    details.push({
      floor: -i,
      usageCode: building.usageCode,
      area: avgFloorArea,
      capacity: avgFloorCapacity,
      isWindowless: false, // 不明な場合はfalse
    });
  }

  // 地上階
  for (let i = 1; i <= building.floors; i++) {
    details.push({
      floor: i,
      usageCode: building.usageCode,
      area: avgFloorArea,
      capacity: avgFloorCapacity,
      isEvacuationFloor: i === 1, // 1階を避難階と仮定
      isWindowless: false,
    });
  }

  return details;
}
```

---

## 実装への影響分析

### 優先度：最高（設計の根幹）
1. **階×用途マトリクス構造** (floorUsageDetails): 令第9条対応の基盤
2. **用途別集計関数** (calculateUsageSummaries): 各用途を独立した防火対象物とみなす判定
3. **階別集計関数** (calculateFloorSummaries): 階ごとの合計面積・収容人員判定

### 優先度：高（多くの条文で使用）
4. **構造種別** (structureType): 第11条、第19条、第25条、第27条
5. **特定部分の面積情報（拡張）**: 第13条で大幅に追加が必要
6. **危険物・指定可燃物（詳細分類）**: 第10条、第11条、第12条、第13条、第21条★NEW

### 優先度：中（特定条文で重要）
7. **建築物高さ**: 第27条
8. **みなし規定関連**: 第9条、第9条の2

### 優先度：低（限定的な条文でのみ使用）
9. **火使用設備**: 第10条1号ロのみ
10. **温泉採取設備**: 第21条の2第3号のみ
11. **電気設備**: 第22条7号のみ
12. **同一敷地内複数建築物**: 第19条、第27条

---

## UI/入力フォームの設計

### 入力フローの設計

#### Step 1: 基本情報入力
```typescript
{
  usageCode: '16-i' | '6-ro-1' | ...,  // (16)項か単一用途か
  totalArea: 2000,
  floors: 5,
  undergroundFloors: 1,
  structureType: 'fireproof',
}
```

#### Step 2: 用途構成の選択（(16)項の場合のみ）
```
✓ (16)項の複合用途建築物ですか？
  → はい: 各階の用途・面積を詳細入力
  → いいえ: 簡易入力（全階同一用途）
```

#### Step 3-A: 階×用途マトリクス入力（複合用途の場合）

テーブル形式で入力:

| 階 | 用途を追加 | 面積(㎡) | 収容人員 | 無窓階 | 避難階 | 直通階段数 | 操作 |
|----|-----------|---------|---------|--------|--------|-----------|------|
| B1 | (4)項 ▼ | 150 | 30 | ☐ | ☐ | 2 | [削除] |
| B1 | [+用途追加] |||||| |
| 1F | (4)項 ▼ | 200 | 50 | ☐ | ☑ | - | [削除] |
| 1F | (6)項ロ(1) ▼ | 200 | 60 | ☐ | ☑ | - | [削除] |
| 2F | (6)項ロ(1) ▼ | 400 | 100 | ☐ | ☐ | 2 | [削除] |
| 3F | (6)項ロ(1) ▼ | 400 | 100 | ☑ | ☐ | 2 | [削除] |
| [+階を追加] |||||||

**自動計算表示:**
```
用途別集計:
- (4)項: 総面積 350㎡（B1:150㎡, 1F:200㎡）/ 収容人員 80人
- (6)項ロ(1): 総面積 1,200㎡（1F:200㎡, 2F:400㎡, 3F:400㎡, ...）/ 収容人員 360人

階別集計:
- B1: 総面積 300㎡ / 収容人員 90人 / 用途数 2
- 1F: 総面積 400㎡ / 収容人員 110人 / 用途数 2（避難階）
- 2F: 総面積 400㎡ / 収容人員 100人 / 用途数 1
- 3F: 総面積 400㎡ / 収容人員 100人 / 用途数 1（無窓階）
```

#### Step 3-B: 簡易入力（単一用途の場合）

```typescript
{
  // 全階同一用途と仮定
  totalArea: 1500,
  floors: 5,
  capacity: 300, // 全体の収容人員
  
  // オプション: 階ごとの特性を指定
  windowlessFloors: [3], // 無窓階のリスト
  evacuationFloor: 1,    // 避難階
}

// 内部で自動変換:
// avgFloorArea = 1500 / 5 = 300㎡
// floorUsageDetails = [
//   { floor: 1, usageCode: '6-ro-1', area: 300, isEvacuationFloor: true },
//   { floor: 2, usageCode: '6-ro-1', area: 300 },
//   { floor: 3, usageCode: '6-ro-1', area: 300, isWindowless: true },
//   ...
// ]
```

#### Step 4: 特定部分の詳細情報（該当する場合のみ）

```
✓ 以下の特定部分はありますか？
  ☐ 舞台部
  ☐ ヘリポート
  ☐ 道路部分（車両交通用）
  ☐ 駐車場（機械式含む）
  ☐ 自動車修理・整備用部分
  ☐ 電気設備室
  ☐ 通信機器室
  ☐ 多量火気使用部分
  ☐ 指定可燃物の貯蔵・取扱い
```

---

## 第13条（水噴霧消火設備等）の追加による主な変更点

### 1. 新設備種別の追加
- 水噴霧消火設備
- 泡消火設備
- 不活性ガス消火設備
- ハロゲン化物消火設備
- 粉末消火設備

これらは**選択式**の設置基準（「いずれか」を設置）であり、従来の設備とは判定ロジックが異なる

### 2. 特定用途部分の大幅な拡張
第13条は用途ではなく「部分」での判定が中心:
- ヘリポート（屋上部分）
- 道路部分（車両交通用、屋上600㎡以上 / それ以外400㎡以上）
- 自動車修理・整備用部分（階により面積基準が異なる）
- 駐車用部分（機械式駐車場の収容台数10台以上）
- 電気設備室（発電機、変圧器等）
- 多量火気使用部分（鍛造場、ボイラー室、乾燥室等）
- 通信機器室（500㎡以上）

### 3. 指定可燃物の詳細分類の必要性
第13条では指定可燃物の**種類**により設置すべき消火設備が異なる:
- 綿花類、木毛、かんなくず等 → 水噴霧、泡、全域放出不活性ガス
- 油がしみ込んだぼろ・紙くず、石炭・木炭類 → 水噴霧、泡
- 可燃性固体類、可燃性液体類、合成樹脂類 → 水噴霧、泡、不活性ガス、ハロゲン化物、粉末
- 木材加工品、木くず → 水噴霧、泡、全域放出不活性ガス、全域放出ハロゲン化物

### 4. 第9条・第9条の2のみなし規定
(16)項の複合用途建築物や、地下街と一体を成す地階の扱いについて、条項ごとに適用除外がある

---

## 次のステップ

### フェーズ1: 型定義の更新
- ✅ `FloorUsageDetail`型を定義
- ✅ `UsageSummary`型を定義
- ✅ `FloorSummary`型を定義
- ✅ `BuildingInfo`に`floorUsageDetails`を追加
- `EquipmentType`に第13条対応の5種類を追加
- 既存のテストケースが壊れないように後方互換性を保つ
- 指定可燃物の詳細分類型を追加

### フェーズ2: ヘルパー関数の実装
- ✅ `calculateUsageSummaries()` - 用途別集計
- ✅ `calculateFloorSummaries()` - 階別集計
- ✅ `hasSpecificUsageInLowerFloors()` - 下階の特定用途判定
- ✅ `ensureFloorUsageDetails()` - 後方互換性（単一用途の自動変換）
- `getAreaThresholdForUsage()` - 用途別の面積基準取得

### フェーズ3: 条件評価エンジンの拡張
- 新しい`ConditionType`の追加
  - `floorArea`, `floorCapacity`, `usageTotalArea`, `usageBasementArea`, etc.
  - 特定部分の用途・面積判定（`heliport`, `autoRepair`, `electricalRoom`等）
- 複雑な条件評価ロジックの実装
  - ✅ 「各用途を独立した防火対象物とみなす」判定（令第9条）
  - ✅ 「階×用途」の組み合わせ判定
  - 構造種別による緩和規定の計算
  - **「いずれか」を選択する設備の判定ロジック**（第13条）
  - みなし規定の適用判定（第9条・第9条の2）

### フェーズ4: ルール定義の更新
- 各条文に対応するルールファイルの詳細化
- ✅ 判定パターンの6分類を実装
- 第13条のルール定義（指定可燃物の種類と設備の対応表）
- 総務省令で定める基準の具体化（別途調査が必要）

### フェーズ5: UI/入力フォームの実装
- 基本情報入力フォーム
- ✅ 用途構成の選択（複合 or 単一）
- ✅ 階×用途マトリクス入力（テーブル形式）
- ✅ 自動集計表示（用途別・階別）
- ✅ 簡易入力モード（単一用途）
- 特定部分（ヘリポート、駐車場、自動車整備等）の入力UI
- 指定可燃物の種類・数量の入力UI
- バリデーション（totalAreaとfloorUsageDetailsの合計の整合性チェック等）

---

## 備考
- 「総務省令で定める」という記載が多数あり、具体的な基準は別途規則を確認する必要がある
- **階×用途マトリクス構造により、令第9条の複合用途建築物の判定が正確に実装できる**
- 単一用途建築物の場合も`floorUsageDetails`で統一的に扱うことで、判定ロジックがシンプルになる
- 後方互換性のため、簡易入力（基本属性のみ）から`floorUsageDetails`への自動変換を提供
- **第13条の選択式設備判定は、既存の単一設備判定とは異なるロジックが必要**
  - 例: 「水噴霧、泡、不活性ガス、ハロゲン化物、粉末のいずれか」
  - UIでは「該当する」という判定結果と、選択可能な設備リストを提示する必要がある
- **第9条・第9条の2のみなし規定は、判定対象の前処理として実装すべき**
  - (16)項の部分を独立した防火対象物とみなす処理
  - 地下街と一体を成す地階の扱い
  - ただし一部条項では除外されるため、条項ごとの適用判定が必要
- **データ整合性チェックが重要**
  - `totalArea` = Σ `floorUsageDetails[].area`
  - `capacity` = Σ `floorUsageDetails[].capacity`
  - 同一階の`isWindowless`等の属性は統一されているか
  - 階数と`floorUsageDetails`の階の範囲が一致しているか

---

## チェックボックス入力方式の設計

### 設計方針

ユーザーが**できるだけ簡単に入力できる**ように、数値入力ではなくチェックボックス方式を採用します。

#### 基本原則
1. **正確な面積を把握しにくい項目**はチェックボックスに
2. **複数の基準値がある項目**も、基準ごとにチェックボックスを用意
3. **階と面積基準の組み合わせ**は、該当パターンを選択式に
4. **判定に必要な情報のみ**を入力させる

---

### チェックボックス化対象項目

#### 1. 単一基準項目（優先度: ★★★）

| 項目 | 現在の設計 | チェックボックス化 | 判定基準 | 該当条文 |
|------|-----------|------------------|---------|---------|
| 通信機器室 | `communicationRoomArea?: number` | `hasCommunicationRoom500sqmOrMore?: boolean` | 500㎡以上 | 第13条、第21条15号 |
| 電気設備室 | `electricalEquipmentRoomArea?: number` | `hasElectricalRoom200sqmOrMore?: boolean` | 200㎡以上 | 第13条 |
| 多量火気使用部分 | `highFireUseArea?: number` | `hasHighFireUse200sqmOrMore?: boolean` | 200㎡以上 | 第13条 |
| ヘリポート | `heliportArea?: number` + `heliportIsRooftop?: boolean` | `hasHeliportRooftop600sqmOrMore?: boolean` | 屋上600㎡以上 | 第13条 |
| 機械式駐車場 | `parkingVehicleCapacity?: number` | `hasMechanicalParking10OrMore?: boolean` | 10台以上 | 第13条 |

#### 2. 複数基準項目（階×面積の組み合わせ）

##### 舞台部
**条文**: 第12条2号、第28条2号
**基準**:
- 地階・無窓階・4階以上: 300㎡以上
- 1階～3階（窓あり）: 500㎡以上

**チェックボックス化**:
```typescript
stage?: {
  // いずれか該当するものをチェック
  basementOrWindowlessOrFloor4Plus300sqm?: boolean;  // 地階・無窓階・4階以上で300㎡以上
  floor1to3With500sqm?: boolean;                     // 1階～3階（窓あり）で500㎡以上
};
```

**UI例**:
```
舞台部がありますか？
□ 地階・無窓階・4階以上の階にあり、床面積が300㎡以上
□ 1階～3階（窓あり）にあり、床面積が500㎡以上
```

##### 道路用部分（車両交通用）
**条文**: 第13条、第21条12号、第29条5号
**基準**:
- 屋上: 600㎡以上
- それ以外: 400㎡以上

**チェックボックス化**:
```typescript
roadVehicleUse?: {
  rooftop600sqmOrMore?: boolean;       // 屋上で600㎡以上
  otherFloor400sqmOrMore?: boolean;    // それ以外の階で400㎡以上
};
```

**UI例**:
```
道路用部分（車両交通用）がありますか？
□ 屋上にあり、床面積が600㎡以上
□ 屋上以外の階にあり、床面積が400㎡以上
```

##### 駐車用部分
**条文**: 第13条、第21条13号
**基準**:
- 地階・2階以上: 200㎡以上
- 1階: 500㎡以上
- 屋上: 300㎡以上

**チェックボックス化**:
```typescript
parking?: {
  basementOr2ndFloorPlus200sqm?: boolean;  // 地階・2階以上で200㎡以上
  floor1_500sqm?: boolean;                  // 1階で500㎡以上
  rooftop300sqm?: boolean;                  // 屋上で300㎡以上
  canAllVehiclesExitSimultaneously?: boolean; // 全車両同時屋外退出可能
};
```

**UI例**:
```
駐車用部分がありますか？
□ 地階または2階以上にあり、床面積が200㎡以上
□ 1階にあり、床面積が500㎡以上
□ 屋上にあり、床面積が300㎡以上
□ すべての車両が同時に屋外に退出できる構造
```

##### 自動車修理・整備用部分
**条文**: 第13条
**基準**:
- 地階・2階以上: 200㎡以上
- 1階: 500㎡以上

**チェックボックス化**:
```typescript
autoRepair?: {
  basementOr2ndFloorPlus200sqm?: boolean;  // 地階・2階以上で200㎡以上
  floor1_500sqm?: boolean;                  // 1階で500㎡以上
};
```

**UI例**:
```
自動車の修理または整備用部分がありますか？
□ 地階または2階以上にあり、床面積が200㎡以上
□ 1階にあり、床面積が500㎡以上
```

---

### 推奨する型定義

```typescript
export interface BuildingInfo {
  // ... 既存の基本属性 ...

  specificAreas?: {
    // === 単一基準項目（チェックボックス） ===
    hasCommunicationRoom500sqmOrMore?: boolean;   // 通信機器室（500㎡以上）
    hasElectricalRoom200sqmOrMore?: boolean;      // 電気設備室（200㎡以上）
    hasHighFireUse200sqmOrMore?: boolean;         // 多量火気使用部分（200㎡以上）
    hasHeliportRooftop600sqmOrMore?: boolean;     // ヘリポート（屋上、600㎡以上）
    hasMechanicalParking10OrMore?: boolean;       // 機械式駐車場（10台以上）
    
    // === 複数基準項目（階×面積パターン） ===
    stage?: {
      basementOrWindowlessOrFloor4Plus300sqm?: boolean;  // 地階・無窓階・4階以上で300㎡以上
      floor1to3With500sqm?: boolean;                     // 1階～3階（窓あり）で500㎡以上
    };
    
    roadVehicleUse?: {
      rooftop600sqmOrMore?: boolean;       // 屋上で600㎡以上
      otherFloor400sqmOrMore?: boolean;    // それ以外の階で400㎡以上
    };
    
    parking?: {
      basementOr2ndFloorPlus200sqm?: boolean;  // 地階・2階以上で200㎡以上
      floor1_500sqm?: boolean;                  // 1階で500㎡以上
      rooftop300sqm?: boolean;                  // 屋上で300㎡以上
      canAllVehiclesExitSimultaneously?: boolean; // 全車両同時屋外退出可能
    };
    
    autoRepair?: {
      basementOr2ndFloorPlus200sqm?: boolean;  // 地階・2階以上で200㎡以上
      floor1_500sqm?: boolean;                  // 1階で500㎡以上
    };
    
    // === その他（数値入力が必要な項目） ===
    rackWarehouseCeilingHeight?: number;  // ラック式倉庫の天井高さ（m）
    siteArea?: number;                    // 敷地面積（㎡）
  };
}
```

---

### UIフォーム例

#### Step 1: 単一基準項目

```
特定部分の有無をチェックしてください

□ 通信機器室（500㎡以上）がある
□ 電気設備室（発電機、変圧器等の室、200㎡以上）がある
□ 多量火気使用部分（鍛造場、ボイラー室、乾燥室等、200㎡以上）がある
□ ヘリポート（屋上部分、600㎡以上）がある
□ 機械式駐車場（収容台数10台以上）がある
```

#### Step 2: 複数基準項目（該当する場合のみ表示）

```
舞台部について教えてください
該当するものをすべてチェックしてください

□ 地階・無窓階・4階以上の階にあり、床面積が300㎡以上
□ 1階～3階（窓あり）にあり、床面積が500㎡以上

---

道路用部分（車両交通用）について教えてください

□ 屋上にあり、床面積が600㎡以上
□ 屋上以外の階にあり、床面積が400㎡以上

---

駐車用部分について教えてください

□ 地階または2階以上にあり、床面積が200㎡以上
□ 1階にあり、床面積が500㎡以上
□ 屋上にあり、床面積が300㎡以上
□ すべての車両が同時に屋外に退出できる構造である

---

自動車の修理または整備用部分について教えてください

□ 地階または2階以上にあり、床面積が200㎡以上
□ 1階にあり、床面積が500㎡以上
```

---

### 判定ロジックの実装例

#### 単一基準項目の判定

```typescript
// 第13条: 通信機器室（500㎡以上）
function checkArticle13_CommunicationRoom(building: BuildingInfo): boolean {
  return building.specificAreas?.hasCommunicationRoom500sqmOrMore || false;
}

// 第21条15号: 通信機器室（500㎡以上）
function checkArticle21_15(building: BuildingInfo): boolean {
  return building.specificAreas?.hasCommunicationRoom500sqmOrMore || false;
}
```

#### 複数基準項目の判定（OR条件）

```typescript
// 第12条2号: 舞台部（階により基準が異なる）
function checkArticle12_2(building: BuildingInfo): boolean {
  const stage = building.specificAreas?.stage;
  if (!stage) return false;
  
  // いずれかの条件を満たせば該当
  return stage.basementOrWindowlessOrFloor4Plus300sqm || 
         stage.floor1to3With500sqm || 
         false;
}

// 第21条12号: 道路用部分（車両交通用）
function checkArticle21_12(building: BuildingInfo): boolean {
  const road = building.specificAreas?.roadVehicleUse;
  if (!road) return false;
  
  return road.rooftop600sqmOrMore || 
         road.otherFloor400sqmOrMore || 
         false;
}

// 第21条13号: 駐車用部分（階により基準が異なる）
function checkArticle21_13(building: BuildingInfo): boolean {
  const parking = building.specificAreas?.parking;
  if (!parking) return false;
  
  // 全車両同時退出可能な場合は除外
  if (parking.canAllVehiclesExitSimultaneously) {
    return false;
  }
  
  // いずれかの面積基準を満たせば該当
  return parking.basementOr2ndFloorPlus200sqm || 
         parking.floor1_500sqm || 
         parking.rooftop300sqm || 
         false;
}
```

---

### メリット

#### ユーザビリティ
- ✅ **入力が簡単**: チェックボックスをON/OFFするだけ
- ✅ **誤入力のリスク低減**: 数値入力ミス（499㎡ vs 500㎡）がなくなる
- ✅ **図面確認がスムーズ**: 「基準を満たすか否か」を目視で確認
- ✅ **専門知識不要**: 正確な面積計算が不要

#### 実装面
- ✅ **判定ロジックがシンプル**: Boolean値の確認のみ
- ✅ **型安全**: TypeScriptの型チェックが効く
- ✅ **可読性向上**: コードが明確で理解しやすい
- ✅ **バリデーション不要**: 数値範囲チェックが不要

#### 保守性
- ✅ **基準値の変更に強い**: 法改正時もフィールド名で意図が明確
- ✅ **テストが書きやすい**: Boolean値のテストは単純
- ✅ **ドキュメント化**: フィールド名自体が仕様書になる
