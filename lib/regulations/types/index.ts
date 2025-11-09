/**
 * 消防法施行令別表第一 用途コード型定義
 * 全47用途コードのリテラル型
 */
export type UsageCode =
  | '1-i'
  | '1-ro'
  | '2-i'
  | '2-ro'
  | '2-ha'
  | '2-ni'
  | '3-i'
  | '3-ro'
  | '4'
  | '5-i'
  | '5-ro'
  | '6-i-1'
  | '6-i-2'
  | '6-i-3'
  | '6-i-4'
  | '6-ro-1'
  | '6-ro-2'
  | '6-ro-3'
  | '6-ro-4'
  | '6-ro-5'
  | '6-ha-1'
  | '6-ha-2'
  | '6-ha-3'
  | '6-ha-4'
  | '6-ha-5'
  | '6-ni'
  | '7'
  | '8'
  | '9-i'
  | '9-ro'
  | '10'
  | '11'
  | '12-i'
  | '12-ro'
  | '13-i'
  | '13-ro'
  | '14'
  | '15'
  | '16-i'
  | '16-ro'
  | '16-2'
  | '16-3'
  | '17'
  | '18'
  | '19'
  | '20';

/**
 * 用途分類情報
 */
export interface UsageType {
  code: UsageCode;
  name: string;
  isSpecific: boolean; // 特定用途かどうか
  category: string; // カテゴリ(一項、二項等)
  legalReference: string; // 法令参照
}

/**
 * 階×用途の詳細情報
 */
export interface FloorUsageDetail {
  floor: number; // 階数（地階は負の数：-1, -2, ...）
  usageCode: UsageCode; // 用途コード
  area: number; // その階・その用途の床面積（㎡）
  capacity?: number; // その階・その用途の収容人員
  
  // 以下は階全体の属性（同一階の複数用途で共通）
  isWindowless?: boolean; // 無窓階かどうか
  isEvacuationFloor?: boolean; // 避難階かどうか
  directStairCount?: number; // 避難階又は地上に直通する階段の数
  hasEffectiveOutdoorStair?: boolean; // 総務省令で定める避難上有効な構造の屋外階段あり
  hasFirewallSeparation?: boolean; // 避難上有効な開口部を有しない壁で区画あり
}

/**
 * 用途ごとの集計情報（floorUsageDetailsから自動計算）
 */
export interface UsageSummary {
  usageCode: UsageCode;
  totalArea: number; // その用途の床面積合計（全階）
  totalCapacity?: number; // その用途の収容人員合計（全階）
  floors: number[]; // その用途が存在する階のリスト
  
  // 地階・無窓階・特定階の面積（用途ごと）
  basementArea?: number; // 地階の面積合計
  basementFloors?: number[]; // 地階のリスト
  windowlessArea?: number; // 無窓階の面積合計
  windowlessFloors?: number[]; // 無窓階のリスト
  floor3AndAboveArea?: number; // 3階以上の面積合計
  floor4AndAboveArea?: number; // 4階以上の面積合計
  floor4To10Area?: number; // 4階以上10階以下の面積合計
  floor11AndAboveArea?: number; // 11階以上の面積合計
  
  // 収容人員の階別集計
  floorCapacities?: {
    floor: number;
    capacity: number;
  }[];
}

/**
 * 階ごとの集計情報
 */
export interface FloorSummary {
  floor: number;
  totalArea: number; // その階の総面積（全用途合計）
  totalCapacity?: number; // その階の総収容人員（全用途合計）
  usages: UsageCode[]; // その階に存在する用途のリスト
  isWindowless?: boolean;
  isEvacuationFloor?: boolean;
  directStairCount?: number;
}

/**
 * 建築物情報
 */
export interface BuildingInfo {
  usageCode: UsageCode;
  totalArea: number; // 延床面積(㎡)
  floors: number; // 階数
  undergroundFloors: number; // 地階数
  capacity?: number; // 収容人員
  height?: number; // 高さ(m)
  
  // === 階×用途マトリクス（複合用途・(16)項対応）===
  floorUsageDetails?: FloorUsageDetail[];
  
  // === 構造情報 ===
  structureType?: 'fireproof' | 'quasi-fireproof' | 'other';
  structureDetails?: {
    specialMainStructureFireproof?: boolean; // 特定主要構造部が耐火構造
    wallInteriorFinish?: 'incombustible' | 'quasi-incombustible' | 'flame-retardant' | 'other';
    ceilingInteriorFinish?: 'incombustible' | 'quasi-incombustible' | 'flame-retardant' | 'other';
    qualifiesForBCL2_9_3?: boolean; // 建築基準法2条9の3イ・ロ該当
  };
  hasFireSpreadSuppressionStructure?: boolean; // 火災発生時の延焼を抑制する機能を備える構造
  hasWireNetConstruction?: boolean; // 鉄網入り壁・床・天井（準不燃材料以外）の有無
  
  // === 特定部分の面積情報（チェックボックス方式）===
  specificAreas?: {
    // 単一基準項目
    hasCommunicationRoom500sqmOrMore?: boolean; // 通信機器室（500㎡以上）
    hasElectricalRoom200sqmOrMore?: boolean; // 電気設備室（200㎡以上）
    hasHighFireUse200sqmOrMore?: boolean; // 多量火気使用部分（200㎡以上）
    hasHeliportRooftop600sqmOrMore?: boolean; // ヘリポート（屋上、600㎡以上）
    hasMechanicalParking10OrMore?: boolean; // 機械式駐車場（10台以上）
    
    // 複数基準項目（階×面積パターン）
    stage?: {
      basementOrWindowlessOrFloor4Plus300sqm?: boolean; // 地階・無窓階・4階以上で300㎡以上
      floor1to3With500sqm?: boolean; // 1階～3階（窓あり）で500㎡以上
    };
    
    roadVehicleUse?: {
      rooftop600sqmOrMore?: boolean; // 屋上で600㎡以上
      otherFloor400sqmOrMore?: boolean; // それ以外の階で400㎡以上
    };
    
    parking?: {
      basementOr2ndFloorPlus200sqm?: boolean; // 地階・2階以上で200㎡以上
      floor1_500sqm?: boolean; // 1階で500㎡以上
      rooftop300sqm?: boolean; // 屋上で300㎡以上
      canAllVehiclesExitSimultaneously?: boolean; // 全車両同時屋外退出可能
    };
    
    autoRepair?: {
      basementOr2ndFloorPlus200sqm?: boolean; // 地階・2階以上で200㎡以上
      floor1_500sqm?: boolean; // 1階で500㎡以上
    };
    
    // その他（数値入力が必要な項目）
    rackWarehouseCeilingHeight?: number; // ラック式倉庫の天井高さ（m）
    siteArea?: number; // 敷地面積（㎡）
  };
  
  // === 危険物・指定可燃物 ===
  hazardousMaterials?: {
    hasMinorHazardous?: boolean; // 少量危険物の貯蔵・取扱いあり
    designatedQuantityRatio?: number; // 指定数量に対する倍数（1/5以上1未満）
  };
  designatedCombustibles?: {
    hasCombustibles?: boolean; // 指定可燃物の貯蔵・取扱いあり
    regulatedQuantityRatio?: number; // 規制数量に対する倍数
    excludesFlammableLiquids?: boolean; // 可燃性液体類を除く
  };
  
  // === 火使用設備 ===
  hasFireUsingEquipment?: boolean; // 火を使用する設備又は器具あり
  fireUsingEquipmentHasSafety?: boolean; // 防火上有効な措置が講じられているか
  
  // === 温泉採取設備 ===
  hasHotSpringEquipment?: boolean; // 温泉採取設備あり
  hotSpringEquipmentType?: string; // 総務省令で定める温泉採取設備の種類
  hasHotSpringLawConfirmation?: boolean; // 温泉法第14条の5第1項の確認を受けたか
  
  // === 電気設備 ===
  contractedCurrentCapacity?: number; // 契約電流容量（アンペア）
  maxContractedCurrent?: number; // 最大契約電流容量（複数契約種別の場合）
  
  // === 避難関連 ===
  evacuationInfo?: {
    hasEffectiveOpenings?: boolean; // 避難上有効な開口部あり
    isEvacuationEasy?: boolean; // 避難が容易であると認められる（総務省令）
  };
  
  // === 消防機関からの距離 ===
  distanceFromFireStation?: 'normal' | 'significantly-far' | 'other';
  
  // === 同一敷地内の複数建築物 ===
  adjacentBuildings?: {
    buildingId: string;
    floor1ExteriorWallDistance?: number; // 1階外壁間中心線からの水平距離（m）
    floor2ExteriorWallDistance?: number; // 2階外壁間中心線からの水平距離（m）
  }[];
  
  // === 複合用途・地下街のみなし規定（第9条・第9条の2）===
  section16PartTreatment?: {
    treatAsIndependentBuilding?: boolean; // 独立した防火対象物とみなすか
    applicableUsageCode: UsageCode; // みなす用途コード
    excludedArticles?: string[]; // 除外される条項
  };
  undergroundMallIntegration?: {
    isIntegratedWithUndergroundMall?: boolean; // (16-2)項地下街と一体を成すか
    designatedByFireChief?: boolean; // 消防長・消防署長の指定を受けたか
    treatAsUndergroundMallPart?: boolean; // (16-2)項の部分とみなすか
  };
}

/**
 * 設備種別
 */
export type EquipmentType =
  | '消火器'
  | '屋内消火栓設備'
  | 'スプリンクラー設備'
  | '水噴霧消火設備' // 第13条対応
  | '泡消火設備' // 第13条対応
  | '不活性ガス消火設備' // 第13条対応
  | 'ハロゲン化物消火設備' // 第13条対応
  | '粉末消火設備' // 第13条対応
  | '屋外消火栓設備'
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
  | '非常警報設備' // 第24条対応
  | '消防機関へ通報する火災報知設備'; // 第23条対応

/**
 * 条件演算子
 */
export type ConditionOperator = '>=' | '>' | '<=' | '<' | '==' | 'in';

/**
 * 条件タイプ
 */
export type ConditionType = 
  | 'usage' 
  | 'area' 
  | 'floors' 
  | 'capacity' 
  | 'height' 
  | 'basement'
  | 'hazardousMaterials' // 少量危険物
  | 'designatedCombustibles'; // 指定可燃物

/**
 * 判定条件
 */
export interface Condition {
  type: ConditionType;
  operator: ConditionOperator;
  value: number | string | string[] | boolean;
  unit?: string;
}

/**
 * 設備設置基準ルール
 */
export interface InstallationRule {
  id: string;
  equipmentType: EquipmentType;
  conditions: Condition[];
  legalBasis: string; // 法令根拠
  priority: number; // 優先度
  scope?: string; // 設置範囲
  notes?: string; // 補足説明
}

/**
 * 設備要件
 */
export interface EquipmentRequirement {
  equipmentType: EquipmentType;
  required: boolean;
  scope?: string; // 設置範囲
  deviceType?: string; // 具体的な器具種別
  quantity?: number; // 必要数量
  legalBasis: string; // 法令根拠
  notes?: string; // 補足説明
}

/**
 * 判別結果
 */
export interface JudgmentResult {
  buildingInfo: BuildingInfo;
  requiredEquipment: EquipmentRequirement[];
  judgmentDate: Date;
  legalVersion: string; // 適用法令版
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
