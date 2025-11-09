/**
 * 消防法施行令 第21条の2
 * ガス漏れ火災警報設備
 */

import type { BuildingInfo } from '../../types';
import { calculateUsageSummaries } from '../../types';

/**
 * 第21条の2: ガス漏れ火災警報設備の設置基準
 * 
 * 別表第一に掲げる防火対象物で次の各号のいずれかに該当するもの
 * （総務省令で定めるものを除く）
 * 
 * 1号: (16-2)項で延べ面積1,000㎡以上
 * 2号: (16-3)項で延べ面積1,000㎡以上かつ特定用途部分500㎡以上
 * 3号: 温泉採取設備が設置されているもの
 * 4号: 特定用途の地階で床面積合計1,000㎡以上
 * 5号: (16)項イの地階で床面積合計1,000㎡以上かつ特定用途部分500㎡以上
 */

/**
 * 第21条の2 1号: (16-2)項で延べ面積1,000㎡以上
 */
export function checkArticle21_2_1(building: BuildingInfo): boolean {
  return building.usageCode === '16-2' && building.totalArea >= 1000;
}

/**
 * 第21条の2 2号: (16-3)項で延べ面積1,000㎡以上かつ特定用途部分500㎡以上
 */
export function checkArticle21_2_2(building: BuildingInfo): boolean {
  if (building.usageCode !== '16-3') {
    return false;
  }

  if (building.totalArea < 1000) {
    return false;
  }

  // 特定用途部分の床面積合計が500㎡以上
  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    const specificUsages = [
      '1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4',
      '5-i', '6-i-1', '6-i-2', '6-i-3', '6-i-4',
      '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
      '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
      '9-i',
    ];

    const summaries = calculateUsageSummaries(building.floorUsageDetails);
    const specificArea = summaries
      .filter(s => specificUsages.includes(s.usageCode))
      .reduce((sum, s) => sum + s.totalArea, 0);

    return specificArea >= 500;
  }

  // 簡易入力の場合は暫定的にtrue（詳細不明）
  return true;
}

/**
 * 第21条の2 3号: 温泉採取設備が設置されているもの
 * 
 * ただし、温泉法第14条の5第1項の確認を受けた場合は除外
 */
export function checkArticle21_2_3(building: BuildingInfo): boolean {
  if (!building.hasHotSpringEquipment) {
    return false;
  }

  // 温泉法の確認を受けている場合は除外
  if (building.hasHotSpringLawConfirmation) {
    return false;
  }

  // 収容人員が総務省令で定める数に満たない場合は除外
  // ※総務省令の具体的な数値が必要（暫定的に10人と仮定）
  const minCapacity = 10;
  if ((building.capacity || 0) < minCapacity) {
    return false;
  }

  return true;
}

/**
 * 第21条の2 4号: 特定用途の地階で床面積合計1,000㎡以上
 */
export function checkArticle21_2_4(building: BuildingInfo): boolean {
  const specificUsages = [
    '1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4',
    '5-i', '6-i-1', '6-i-2', '6-i-3', '6-i-4',
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
    '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
    '9-i',
  ];

  if (!specificUsages.includes(building.usageCode)) {
    return false;
  }

  // 第3号に該当する場合は除外
  if (checkArticle21_2_3(building)) {
    return false;
  }

  // 地階の床面積合計を計算
  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    const summaries = calculateUsageSummaries(building.floorUsageDetails);
    const basementArea = summaries
      .filter(s => specificUsages.includes(s.usageCode))
      .reduce((sum, s) => sum + (s.basementArea || 0), 0);

    return basementArea >= 1000;
  }

  // 簡易入力の場合は推定
  if (building.undergroundFloors > 0) {
    const avgFloorArea = building.totalArea / (building.floors + building.undergroundFloors);
    const basementArea = avgFloorArea * building.undergroundFloors;
    return basementArea >= 1000;
  }

  return false;
}

/**
 * 第21条の2 5号: (16)項イの地階で床面積合計1,000㎡以上かつ特定用途部分500㎡以上
 */
export function checkArticle21_2_5(building: BuildingInfo): boolean {
  if (building.usageCode !== '16-i') {
    return false;
  }

  // 第3号に該当する場合は除外
  if (checkArticle21_2_3(building)) {
    return false;
  }

  if (!building.floorUsageDetails || building.floorUsageDetails.length === 0) {
    return false;
  }

  const specificUsages = [
    '1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4',
    '5-i', '6-i-1', '6-i-2', '6-i-3', '6-i-4',
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
    '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
    '9-i',
  ];

  const summaries = calculateUsageSummaries(building.floorUsageDetails);

  // 地階の床面積合計が1,000㎡以上
  const totalBasementArea = summaries.reduce((sum, s) => sum + (s.basementArea || 0), 0);
  if (totalBasementArea < 1000) {
    return false;
  }

  // 特定用途部分の地階床面積合計が500㎡以上
  const specificBasementArea = summaries
    .filter(s => specificUsages.includes(s.usageCode))
    .reduce((sum, s) => sum + (s.basementArea || 0), 0);

  return specificBasementArea >= 500;
}

/**
 * 第21条の2 統合判定
 */
export function checkArticle21_2(building: BuildingInfo): boolean {
  return (
    checkArticle21_2_1(building) ||
    checkArticle21_2_2(building) ||
    checkArticle21_2_3(building) ||
    checkArticle21_2_4(building) ||
    checkArticle21_2_5(building)
  );
}
