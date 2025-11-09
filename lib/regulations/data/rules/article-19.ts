/**
 * 消防法施行令 第19条
 * 屋外消火栓設備
 */

import type { BuildingInfo } from '../../types';

/**
 * 第19条: 屋外消火栓設備の設置基準
 * 
 * 1階及び2階の床面積の合計が基準以上
 * - 耐火建築物: 9,000㎡以上
 * - 準耐火建築物: 6,000㎡以上
 * - その他: 3,000㎡以上
 * 
 * ただし、消防ポンプ自動車が容易に接近できる道路、空地等から
 * 有効に放水できる部分は除く
 */
export function checkArticle19(building: BuildingInfo): boolean {
  // 1階及び2階の床面積の合計を計算
  // floorUsageDetailsが存在する場合はそこから計算
  let floor1And2Area = 0;
  
  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    const floor1Details = building.floorUsageDetails.filter(d => d.floor === 1);
    const floor2Details = building.floorUsageDetails.filter(d => d.floor === 2);
    
    floor1And2Area = 
      floor1Details.reduce((sum, d) => sum + d.area, 0) +
      floor2Details.reduce((sum, d) => sum + d.area, 0);
  } else {
    // 簡易入力の場合は推定
    // 1階と2階の面積を推定（全体面積を階数で均等割）
    const avgFloorArea = building.totalArea / building.floors;
    floor1And2Area = avgFloorArea * 2;
  }

  // 構造種別による基準面積の決定
  let thresholdArea = 3000; // デフォルト: その他
  
  if (building.structureType === 'fireproof') {
    thresholdArea = 9000;
  } else if (building.structureType === 'quasi-fireproof') {
    thresholdArea = 6000;
  }

  return floor1And2Area >= thresholdArea;
}

/**
 * 第19条 2項: 同一敷地内の複数建築物の一体判定
 * 
 * 同一敷地内の2以上の建築物で以下を満たす場合、
 * 1つの建築物とみなして判定:
 * - 1階の外壁間の中心線からの水平距離が3m以下
 * - 2階の外壁間の中心線からの水平距離が5m以下
 */
export function checkArticle19_2(building: BuildingInfo): {
  shouldCombine: boolean;
  combinedBuildings: string[];
} {
  if (!building.adjacentBuildings || building.adjacentBuildings.length === 0) {
    return {
      shouldCombine: false,
      combinedBuildings: [],
    };
  }

  const combinedBuildings: string[] = [];

  for (const adjacent of building.adjacentBuildings) {
    const floor1Distance = adjacent.floor1ExteriorWallDistance || Infinity;
    const floor2Distance = adjacent.floor2ExteriorWallDistance || Infinity;

    // 1階が3m以下、2階が5m以下の場合
    if (floor1Distance <= 3 && floor2Distance <= 5) {
      combinedBuildings.push(adjacent.buildingId);
    }
  }

  return {
    shouldCombine: combinedBuildings.length > 0,
    combinedBuildings,
  };
}
