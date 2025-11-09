/**
 * 消防法施行令 第13条
 * 水噴霧消火設備、泡消火設備、不活性ガス消火設備、
 * ハロゲン化物消火設備又は粉末消火設備
 */

import type { BuildingInfo, EquipmentType } from '../../types';

/**
 * 第13条の設備種別（いずれかを選択）
 */
export const ARTICLE_13_EQUIPMENT_TYPES: EquipmentType[] = [
  '水噴霧消火設備',
  '泡消火設備',
  '不活性ガス消火設備',
  'ハロゲン化物消火設備',
  '粉末消火設備',
];

/**
 * 第13条 判定結果
 */
export interface Article13Result {
  required: boolean;
  applicableEquipment: EquipmentType[]; // 設置可能な設備リスト
  legalBasis: string;
  notes?: string;
}

/**
 * 第13条 1号: ヘリポート（屋上部分で600㎡以上）
 */
export function checkArticle13_1(building: BuildingInfo): Article13Result {
  const hasHeliport = building.specificAreas?.hasHeliportRooftop600sqmOrMore || false;

  if (hasHeliport) {
    return {
      required: true,
      applicableEquipment: ['泡消火設備'],
      legalBasis: '消防法施行令第13条第1号',
      notes: 'ヘリポート（屋上部分、600㎡以上）',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第1号',
  };
}

/**
 * 第13条 2号: 道路用部分（車両交通用、屋上600㎡以上またはそれ以外400㎡以上）
 */
export function checkArticle13_2(building: BuildingInfo): Article13Result {
  const road = building.specificAreas?.roadVehicleUse;
  const hasRoad = road?.rooftop600sqmOrMore || road?.otherFloor400sqmOrMore || false;

  if (hasRoad) {
    return {
      required: true,
      applicableEquipment: ['泡消火設備'],
      legalBasis: '消防法施行令第13条第2号',
      notes: '道路の用に供される部分（車両の交通の用）',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第2号',
  };
}

/**
 * 第13条 3号イ: 自動車修理・整備用部分（地階・2階以上で200㎡以上、1階で500㎡以上）
 */
export function checkArticle13_3_i(building: BuildingInfo): Article13Result {
  const autoRepair = building.specificAreas?.autoRepair;
  const hasAutoRepair = 
    autoRepair?.basementOr2ndFloorPlus200sqm || 
    autoRepair?.floor1_500sqm || 
    false;

  if (hasAutoRepair) {
    return {
      required: true,
      applicableEquipment: ['泡消火設備'],
      legalBasis: '消防法施行令第13条第3号イ',
      notes: '自動車の修理又は整備の用に供する部分',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第3号イ',
  };
}

/**
 * 第13条 3号ロ: 駐車用部分（地階・2階以上で200㎡以上、1階で500㎡以上、屋上で300㎡以上）
 * ただし全車両が同時に屋外に退出できる構造を除く
 */
export function checkArticle13_3_ro(building: BuildingInfo): Article13Result {
  const parking = building.specificAreas?.parking;
  
  // 全車両同時退出可能な場合は除外
  if (parking?.canAllVehiclesExitSimultaneously) {
    return {
      required: false,
      applicableEquipment: [],
      legalBasis: '消防法施行令第13条第3号ロ',
      notes: '全車両が同時に屋外に退出できる構造のため除外',
    };
  }

  const hasParking = 
    parking?.basementOr2ndFloorPlus200sqm || 
    parking?.floor1_500sqm || 
    parking?.rooftop300sqm || 
    false;

  if (hasParking) {
    return {
      required: true,
      applicableEquipment: ['泡消火設備'],
      legalBasis: '消防法施行令第13条第3号ロ',
      notes: '駐車の用に供する部分',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第3号ロ',
  };
}

/**
 * 第13条 3号ハ: 機械式駐車場（収容台数10台以上）
 */
export function checkArticle13_3_ha(building: BuildingInfo): Article13Result {
  const hasMechanicalParking = 
    building.specificAreas?.hasMechanicalParking10OrMore || false;

  if (hasMechanicalParking) {
    return {
      required: true,
      applicableEquipment: ['泡消火設備', '不活性ガス消火設備', 'ハロゲン化物消火設備'],
      legalBasis: '消防法施行令第13条第3号ハ',
      notes: '機械式駐車場（収容台数10台以上）',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第3号ハ',
  };
}

/**
 * 第13条 4号: 電気設備室（発電機、変圧器等、200㎡以上）
 */
export function checkArticle13_4(building: BuildingInfo): Article13Result {
  const hasElectricalRoom = 
    building.specificAreas?.hasElectricalRoom200sqmOrMore || false;

  if (hasElectricalRoom) {
    return {
      required: true,
      applicableEquipment: ['不活性ガス消火設備', 'ハロゲン化物消火設備', '粉末消火設備'],
      legalBasis: '消防法施行令第13条第4号',
      notes: '発電機、変圧器等の電気設備室（200㎡以上）',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第4号',
  };
}

/**
 * 第13条 5号: 多量火気使用部分（鍛造場、ボイラー室、乾燥室等、200㎡以上）
 */
export function checkArticle13_5(building: BuildingInfo): Article13Result {
  const hasHighFireUse = 
    building.specificAreas?.hasHighFireUse200sqmOrMore || false;

  if (hasHighFireUse) {
    return {
      required: true,
      applicableEquipment: ['不活性ガス消火設備', 'ハロゲン化物消火設備', '粉末消火設備'],
      legalBasis: '消防法施行令第13条第5号',
      notes: '鍛造場、ボイラー室、乾燥室等の多量の火気を使用する部分（200㎡以上）',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第5号',
  };
}

/**
 * 第13条 6号: 通信機器室（500㎡以上）
 */
export function checkArticle13_6(building: BuildingInfo): Article13Result {
  const hasCommunicationRoom = 
    building.specificAreas?.hasCommunicationRoom500sqmOrMore || false;

  if (hasCommunicationRoom) {
    return {
      required: true,
      applicableEquipment: ['不活性ガス消火設備', 'ハロゲン化物消火設備', '粉末消火設備'],
      legalBasis: '消防法施行令第13条第6号',
      notes: '電子計算機、電話交換機等の通信機器を設置する室（500㎡以上）',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第6号',
  };
}

/**
 * 第13条 7号〜14号: 指定可燃物の貯蔵・取扱い（規制数量の1000倍以上）
 * 
 * ※実装注意: 指定可燃物の詳細分類が必要だが、現時点ではチェックボックス方式の
 * BuildingInfoに指定可燃物の詳細情報が含まれていないため、簡易判定のみ実装
 * 
 * 将来的には designatedCombustibles.combustibleTypes[] を参照して
 * 物品種類ごとに適用可能な設備を判定する必要がある
 */
export function checkArticle13_7to14(building: BuildingInfo): Article13Result {
  const combustibles = building.designatedCombustibles;
  
  // 規制数量の1000倍以上か確認
  const ratio = combustibles?.regulatedQuantityRatio || 0;
  
  if (ratio >= 1000 && combustibles?.hasCombustibles) {
    return {
      required: true,
      applicableEquipment: [
        '水噴霧消火設備',
        '泡消火設備',
        '不活性ガス消火設備',
        'ハロゲン化物消火設備',
        '粉末消火設備',
      ],
      legalBasis: '消防法施行令第13条第7号〜第14号',
      notes: '指定可燃物の貯蔵・取扱い（規制数量の1000倍以上）。物品種類により適用可能な設備が異なる。',
    };
  }

  return {
    required: false,
    applicableEquipment: [],
    legalBasis: '消防法施行令第13条第7号〜第14号',
  };
}

/**
 * 第13条 統合判定
 * 全ての号を確認し、該当するものをすべて返す
 */
export function checkArticle13(building: BuildingInfo): Article13Result[] {
  return [
    checkArticle13_1(building),
    checkArticle13_2(building),
    checkArticle13_3_i(building),
    checkArticle13_3_ro(building),
    checkArticle13_3_ha(building),
    checkArticle13_4(building),
    checkArticle13_5(building),
    checkArticle13_6(building),
    checkArticle13_7to14(building),
  ].filter(result => result.required);
}
