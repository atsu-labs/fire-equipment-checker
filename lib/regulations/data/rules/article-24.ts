/**
 * 消防法施行令 第24条
 * 非常警報器具又は非常ベル
 * 
 * 第23条で規定される非常警報設備の具体的な器具種別を判定
 */

import type { BuildingInfo } from '../../types';

/**
 * 非常警報器具の種別
 */
export type EmergencyAlarmType = 
  | '非常警報器具' // 収容人員20人以上50人未満
  | '非常ベル' // 収容人員50人以上
  | '自動式サイレン' // 収容人員50人以上
  | '放送設備'; // 収容人員による段階的要件

export interface Article24Result {
  required: boolean;
  alarmType: EmergencyAlarmType | null;
  legalBasis: string;
  notes?: string;
}

/**
 * 第24条 1項: 非常警報器具（収容人員20人以上50人未満）
 */
export function checkArticle24_1(building: BuildingInfo): Article24Result {
  const capacity = building.capacity || 0;

  if (capacity >= 20 && capacity < 50) {
    return {
      required: true,
      alarmType: '非常警報器具',
      legalBasis: '消防法施行令第24条第1項',
      notes: '収容人員20人以上50人未満',
    };
  }

  return {
    required: false,
    alarmType: null,
    legalBasis: '消防法施行令第24条第1項',
  };
}

/**
 * 第24条 2項: 非常ベル又は自動式サイレン（収容人員50人以上）
 */
export function checkArticle24_2(building: BuildingInfo): Article24Result {
  const capacity = building.capacity || 0;

  if (capacity >= 50) {
    return {
      required: true,
      alarmType: '非常ベル', // または自動式サイレン
      legalBasis: '消防法施行令第24条第2項',
      notes: '収容人員50人以上。非常ベル又は自動式サイレンのいずれかを設置',
    };
  }

  return {
    required: false,
    alarmType: null,
    legalBasis: '消防法施行令第24条第2項',
  };
}

/**
 * 第24条 3項: 放送設備（収容人員による段階的要件）
 * 
 * - 300人以上: 特定用途で必要
 * - 500人以上: より広範な用途で必要
 * - 800人以上: すべての用途で必要
 */
export function checkArticle24_3(building: BuildingInfo): Article24Result {
  const capacity = building.capacity || 0;
  const usageCode = building.usageCode;

  // 800人以上: すべての用途で放送設備が必要
  if (capacity >= 800) {
    return {
      required: true,
      alarmType: '放送設備',
      legalBasis: '消防法施行令第24条第3項',
      notes: '収容人員800人以上',
    };
  }

  // 500人以上: 一部用途で放送設備が必要
  if (capacity >= 500) {
    const usages500 = [
      '1-i', '2-i', '2-ro', '2-ha', '3-i', '3-ro', '4',
      '5-i', '5-ro', '6-i-1', '6-i-2', '6-i-3', '6-i-4',
      '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
      '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
      '9-i', '9-ro', '16-i', '16-ro',
    ];

    if (usages500.includes(usageCode)) {
      return {
        required: true,
        alarmType: '放送設備',
        legalBasis: '消防法施行令第24条第3項',
        notes: '収容人員500人以上',
      };
    }
  }

  // 300人以上: 特定用途で放送設備が必要
  if (capacity >= 300) {
    const usages300 = [
      '1-i', '2-i', '2-ro', '2-ha', '3-i', '3-ro', '4',
      '5-i', '6-i-1', '6-i-2', '6-i-3', '6-i-4',
      '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
      '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
      '9-i', '16-i',
    ];

    if (usages300.includes(usageCode)) {
      return {
        required: true,
        alarmType: '放送設備',
        legalBasis: '消防法施行令第24条第3項',
        notes: '収容人員300人以上',
      };
    }
  }

  return {
    required: false,
    alarmType: null,
    legalBasis: '消防法施行令第24条第3項',
  };
}

/**
 * 第24条 統合判定
 * 収容人員に応じて最も厳しい（上位の）器具を選択
 */
export function checkArticle24(building: BuildingInfo): Article24Result {
  // 優先度: 放送設備 > 非常ベル > 非常警報器具

  const result3 = checkArticle24_3(building);
  if (result3.required) {
    return result3;
  }

  const result2 = checkArticle24_2(building);
  if (result2.required) {
    return result2;
  }

  const result1 = checkArticle24_1(building);
  if (result1.required) {
    return result1;
  }

  return {
    required: false,
    alarmType: null,
    legalBasis: '消防法施行令第24条',
    notes: '収容人員20人未満のため不要',
  };
}
