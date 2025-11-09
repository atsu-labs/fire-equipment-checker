/**
 * 消防法施行令 第29条の3
 * 排煙設備
 */

import type { BuildingInfo } from '../../types';
import { calculateUsageSummaries } from '../../types';

/**
 * 第29条の3: 排煙設備の設置基準
 * 
 * 別表第一に掲げる防火対象物で、以下のいずれかに該当するもの
 * 
 * 1号: 延べ面積1,000㎡以上
 * 2号: 用途・階・面積により異なる基準
 */

/**
 * 第29条の3 1号: 延べ面積1,000㎡以上
 * 
 * 対象用途: (1)〜(4)項、(5)項イ、(6)項、(9)項イ、(16-2)項、(16-3)項
 */
export function checkArticle29_3_1(building: BuildingInfo): boolean {
  const usageCodes = [
    '1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4',
    '5-i',
    '6-i-1', '6-i-2', '6-i-3', '6-i-4',
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
    '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
    '9-i',
    '16-2', '16-3',
  ];

  if (usageCodes.includes(building.usageCode)) {
    return building.totalArea >= 1000;
  }

  // (16)項イの場合は特定用途部分の合計で判定
  if (building.usageCode === '16-i') {
    if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
      const summaries = calculateUsageSummaries(building.floorUsageDetails);
      
      const specificArea = summaries
        .filter(s => usageCodes.includes(s.usageCode))
        .reduce((sum, s) => sum + s.totalArea, 0);

      return specificArea >= 1000;
    }

    // 簡易入力の場合は総面積で判定（暫定）
    return building.totalArea >= 1000;
  }

  return false;
}

/**
 * 第29条の3 2号イ: 建築基準法施行令第116条の2第1項第1号該当
 * 
 * 劇場、映画館、演芸場、観覧場、公会堂、集会場で、
 * 避難階以外の階で客席・集会室が200㎡以上
 * 
 * ※簡略化: (1)項で避難階以外の階に200㎡以上の部分がある場合
 */
export function checkArticle29_3_2_i(building: BuildingInfo): boolean {
  if (building.usageCode !== '1-i') {
    return false;
  }

  // floorUsageDetailsから避難階以外の階の面積を計算
  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    const nonEvacuationFloors = building.floorUsageDetails.filter(
      d => d.usageCode === '1-i' && !d.isEvacuationFloor
    );

    for (const floor of nonEvacuationFloors) {
      if (floor.area >= 200) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 第29条の3 2号ロ: 建築基準法施行令第116条の2第1項第2号該当
 * 
 * 病院、診療所、ホテル、旅館、百貨店等で、
 * 避難階以外の階で床面積200㎡以上（一部例外あり）
 * 
 * ※簡略化: 対象用途で避難階以外の階に200㎡以上の部分がある場合
 */
export function checkArticle29_3_2_ro(building: BuildingInfo): boolean {
  const targetUsages = [
    '3-i', '3-ro', '4', '5-i', '5-ro',
    '6-i-1', '6-i-2', '6-i-3', '6-i-4',
  ];

  if (!targetUsages.includes(building.usageCode)) {
    return false;
  }

  // floorUsageDetailsから避難階以外の階の面積を計算
  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    const nonEvacuationFloors = building.floorUsageDetails.filter(
      d => targetUsages.includes(d.usageCode) && !d.isEvacuationFloor
    );

    for (const floor of nonEvacuationFloors) {
      if (floor.area >= 200) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 第29条の3 統合判定
 */
export function checkArticle29_3(building: BuildingInfo): boolean {
  return (
    checkArticle29_3_1(building) ||
    checkArticle29_3_2_i(building) ||
    checkArticle29_3_2_ro(building)
  );
}
