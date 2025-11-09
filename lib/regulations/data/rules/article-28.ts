/**
 * 消防法施行令 第28条
 * 連結送水管
 */

import type { BuildingInfo } from '../../types';
import { calculateFloorSummaries, type FloorUsageDetail } from '../../types';

/**
 * 第28条: 連結送水管の設置基準
 * 
 * 1号: 地階を除く階数が7以上
 * 2号: 舞台部（地階・無窓階・4階以上で300㎡以上、その他500㎡以上）
 * 3号: 延べ面積1,000㎡以上の地下街
 */

/**
 * 第28条 1号: 地階を除く階数が7以上
 */
export function checkArticle28_1(building: BuildingInfo): boolean {
  return building.floors >= 7;
}

/**
 * 第28条 2号: 舞台部
 * 
 * - 地階・無窓階・4階以上: 300㎡以上
 * - 1階～3階（窓あり）: 500㎡以上
 */
export function checkArticle28_2(building: BuildingInfo): boolean {
  const stage = building.specificAreas?.stage;
  if (!stage) {
    return false;
  }

  return (
    stage.basementOrWindowlessOrFloor4Plus300sqm ||
    stage.floor1to3With500sqm ||
    false
  );
}

/**
 * 第28条 3号: 延べ面積1,000㎡以上の地下街
 */
export function checkArticle28_3(building: BuildingInfo): boolean {
  // (16-2)項が地下街
  return building.usageCode === '16-2' && building.totalArea >= 1000;
}

/**
 * 第28条 統合判定
 */
export function checkArticle28(building: BuildingInfo): boolean {
  return (
    checkArticle28_1(building) ||
    checkArticle28_2(building) ||
    checkArticle28_3(building)
  );
}
