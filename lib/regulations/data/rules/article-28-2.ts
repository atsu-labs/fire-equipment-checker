/**
 * 消防法施行令 第28条の2
 * 連結散水設備
 */

import type { BuildingInfo } from '../../types';
import { calculateUsageSummaries } from '../../types';

/**
 * 第28条の2: 連結散水設備の設置基準
 * 
 * 地階で床面積の合計が700㎡以上のもの（用途により異なる）
 */

/**
 * 第28条の2 基準面積の取得
 * 
 * 700㎡以上: (1)〜(4)項、(5)項イ、(6)項、(9)項イ
 * 1,000㎡以上: (5)項ロ、(7)〜(15)項、(16)項
 */
function getBasementAreaThreshold(usageCode: string): number {
  const threshold700 = [
    '1-i', '1-ro', '2-i', '2-ro', '2-ha', '2-ni', '3-i', '3-ro', '4',
    '5-i',
    '6-i-1', '6-i-2', '6-i-3', '6-i-4',
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
    '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
    '9-i',
  ];

  if (threshold700.includes(usageCode)) {
    return 700;
  }

  return 1000; // その他は1,000㎡
}

/**
 * 第28条の2 判定
 */
export function checkArticle28_2_RenketsuSansui(building: BuildingInfo): boolean {
  const usageCode = building.usageCode;

  // 地階の床面積合計を計算
  let basementArea = 0;

  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    // floorUsageDetailsから地階面積を計算
    const summaries = calculateUsageSummaries(building.floorUsageDetails);
    
    // (16)項の場合は用途ごとに判定
    if (usageCode.startsWith('16-')) {
      for (const summary of summaries) {
        const threshold = getBasementAreaThreshold(summary.usageCode);
        const usageBasementArea = summary.basementArea || 0;
        
        if (usageBasementArea >= threshold) {
          return true;
        }
      }
      return false;
    } else {
      // 単一用途の場合
      const summary = summaries.find(s => s.usageCode === usageCode);
      basementArea = summary?.basementArea || 0;
    }
  } else {
    // 簡易入力の場合は推定（地階があると仮定）
    if (building.undergroundFloors > 0) {
      const avgFloorArea = building.totalArea / (building.floors + building.undergroundFloors);
      basementArea = avgFloorArea * building.undergroundFloors;
    }
  }

  const threshold = getBasementAreaThreshold(usageCode);
  return basementArea >= threshold;
}
