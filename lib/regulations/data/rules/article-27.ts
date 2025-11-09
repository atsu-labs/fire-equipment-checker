/**
 * 消防法施行令 第27条
 * 消防用水
 */

import type { BuildingInfo } from '../../types';

/**
 * 第27条: 消防用水の設置基準
 * 
 * 1号: 耐火建築物以外で延べ面積15,000㎡以上
 * 2号: 高さ31mを超え、延べ面積25,000㎡以上
 */

/**
 * 第27条 1号: 耐火建築物以外で延べ面積15,000㎡以上
 */
export function checkArticle27_1(building: BuildingInfo): boolean {
  const isNotFireproof = building.structureType !== 'fireproof';
  return isNotFireproof && building.totalArea >= 15000;
}

/**
 * 第27条 2号: 高さ31mを超え、延べ面積25,000㎡以上
 */
export function checkArticle27_2(building: BuildingInfo): boolean {
  const height = building.height || 0;
  return height > 31 && building.totalArea >= 25000;
}

/**
 * 第27条 2項: 同一敷地内の複数建築物の一体判定
 * 
 * 第19条2項と同様の距離基準
 * - 1階の外壁間の中心線からの水平距離が3m以下
 * - 2階の外壁間の中心線からの水平距離が5m以下
 */
export function checkArticle27_2_Combined(building: BuildingInfo): {
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

    if (floor1Distance <= 3 && floor2Distance <= 5) {
      combinedBuildings.push(adjacent.buildingId);
    }
  }

  return {
    shouldCombine: combinedBuildings.length > 0,
    combinedBuildings,
  };
}

/**
 * 第27条 統合判定
 */
export function checkArticle27(building: BuildingInfo): boolean {
  return checkArticle27_1(building) || checkArticle27_2(building);
}
