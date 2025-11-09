import type { BuildingInfo, Condition } from '../types';

/**
 * 条件評価エンジン
 * 
 * 建築物情報と設置基準ルールの条件を照合し、
 * 設備設置義務の有無を判定する
 */

/**
 * 単一条件を評価
 * 
 * @param building 建築物情報
 * @param condition 評価する条件
 * @param ruleId ルールID(緩和規定適用判定に使用)
 * @returns 条件を満たす場合true
 */
export function evaluateCondition(
  building: BuildingInfo,
  condition: Condition,
  ruleId?: string
): boolean {
  switch (condition.type) {
    case 'area':
      return evaluateAreaCondition(building, condition, ruleId);
    
    case 'floors':
      return evaluateFloorsCondition(building, condition);
    
    case 'usage':
      return evaluateUsageCondition(building, condition);
    
    case 'basement':
      return evaluateBasementCondition(building, condition);
    
    case 'capacity':
      return evaluateCapacityCondition(building, condition);
    
    case 'height':
      return evaluateHeightCondition(building, condition);
    
    case 'hazardousMaterials':
      return evaluateHazardousMaterialsCondition(building, condition);
    
    case 'designatedCombustibles':
      return evaluateDesignatedCombustiblesCondition(building, condition);
    
    default:
      console.warn(`Unknown condition type: ${(condition as Condition).type}`);
      return false;
  }
}

/**
 * 面積条件の評価
 * 令第11条第2項の緩和規定を適用
 */
function evaluateAreaCondition(
  building: BuildingInfo,
  condition: Condition,
  ruleId?: string
): boolean {
  if (condition.type !== 'area' || typeof condition.value !== 'number') return false;
  
  let threshold = condition.value;
  
  // 令第11条第2項: 屋内消火栓設備の面積基準緩和
  if (ruleId?.startsWith('IH-')) {
    threshold = applyArticle11Relaxation(building, threshold, ruleId);
  }
  
  const actualArea = building.totalArea;
  
  return compareValues(actualArea, condition.operator, threshold);
}

/**
 * 令第11条第2項による面積基準の緩和
 * 
 * 緩和条件:
 * - 特定主要構造部が耐火構造 + 内装難燃材料 → 3倍
 * - 特定主要構造部が耐火構造のみ → 2倍
 * - 建築基準法2条9の3該当 + 内装難燃材料 → 2倍
 * 
 * ただし、第2号(IH-002)については第12条との連携で上限あり
 */
function applyArticle11Relaxation(
  building: BuildingInfo,
  threshold: number,
  ruleId: string
): number {
  // 第5号(指定可燃物)は緩和対象外
  if (ruleId === 'IH-005') {
    return threshold;
  }
  
  // 3倍緩和: 特定主要構造部が耐火構造 + 内装難燃材料
  const hasFlameRetardantInterior = 
    building.structureDetails?.wallInteriorFinish === 'flame-retardant' &&
    building.structureDetails?.ceilingInteriorFinish === 'flame-retardant';
  
  if (
    building.structureDetails?.specialMainStructureFireproof &&
    hasFlameRetardantInterior
  ) {
    let relaxedThreshold = threshold * 3;
    
    // 第2号の場合の上限値適用
    if (ruleId === 'IH-002') {
      // TODO: 第12条第2項第3号の2との連携
      // 上限 = 1000㎡ + スプリンクラー設置免除部分の床面積合計
      // 現時点では単純に3倍とする
    }
    
    return relaxedThreshold;
  }
  
  // 2倍緩和: 特定主要構造部が耐火構造のみ
  if (building.structureDetails?.specialMainStructureFireproof) {
    let relaxedThreshold = threshold * 2;
    
    // 第2号の場合の上限値適用
    if (ruleId === 'IH-002') {
      // TODO: 第12条第2項第3号の2との連携
    }
    
    return relaxedThreshold;
  }
  
  // 2倍緩和: 建築基準法2条9の3該当 + 内装難燃材料
  if (
    building.structureDetails?.qualifiesForBCL2_9_3 &&
    hasFlameRetardantInterior
  ) {
    let relaxedThreshold = threshold * 2;
    
    // 第2号の場合の上限値適用
    if (ruleId === 'IH-002') {
      // TODO: 第12条第2項第3号の2との連携
    }
    
    return relaxedThreshold;
  }
  
  return threshold;
}

/**
 * 階数条件の評価
 */
function evaluateFloorsCondition(
  building: BuildingInfo,
  condition: Condition
): boolean {
  if (condition.type !== 'floors' || typeof condition.value !== 'number') return false;
  
  return compareValues(building.floors, condition.operator, condition.value);
}

/**
 * 用途条件の評価
 */
function evaluateUsageCondition(
  building: BuildingInfo,
  condition: Condition
): boolean {
  if (condition.type !== 'usage') return false;
  
  switch (condition.operator) {
    case '==':
      return building.usageCode === condition.value;
    
    case 'in':
      if (!Array.isArray(condition.value)) return false;
      return condition.value.includes(building.usageCode);
    
    default:
      return false;
  }
}

/**
 * 地階条件の評価
 */
function evaluateBasementCondition(
  building: BuildingInfo,
  condition: Condition
): boolean {
  if (condition.type !== 'basement') return false;
  
  const hasBasement = building.undergroundFloors > 0;
  
  return condition.value === true ? hasBasement : !hasBasement;
}

/**
 * 収容人員条件の評価
 */
function evaluateCapacityCondition(
  building: BuildingInfo,
  condition: Condition
): boolean {
  if (condition.type !== 'capacity' || typeof condition.value !== 'number') return false;
  
  const capacity = building.capacity ?? 0;
  
  return compareValues(capacity, condition.operator, condition.value);
}

/**
 * 高さ条件の評価
 */
function evaluateHeightCondition(
  building: BuildingInfo,
  condition: Condition
): boolean {
  if (condition.type !== 'height' || typeof condition.value !== 'number') return false;
  
  const height = building.height ?? 0;
  
  return compareValues(height, condition.operator, condition.value);
}

/**
 * 少量危険物条件の評価
 * 令第10条第1項第4号: 指定数量の1/5以上1未満
 */
function evaluateHazardousMaterialsCondition(
  building: BuildingInfo,
  condition: Condition
): boolean {
  if (condition.type !== 'hazardousMaterials') return false;
  
  // 少量危険物がない場合はfalse
  if (!building.hazardousMaterials?.hasMinorHazardous) return false;
  
  // 倍数指定がある場合は比較
  if (typeof condition.value === 'number' && building.hazardousMaterials.designatedQuantityRatio !== undefined) {
    return compareValues(building.hazardousMaterials.designatedQuantityRatio, condition.operator, condition.value);
  }
  
  // 単純な有無判定
  return building.hazardousMaterials.hasMinorHazardous === condition.value;
}

/**
 * 指定可燃物条件の評価
 * 令第10条第1項第4号: 規制数量以上
 * 令第11条第1項第5号: 規制数量の750倍以上(可燃性液体類除く)
 */
function evaluateDesignatedCombustiblesCondition(
  building: BuildingInfo,
  condition: Condition
): boolean {
  if (condition.type !== 'designatedCombustibles') return false;
  
  // 指定可燃物がない場合はfalse
  if (!building.designatedCombustibles?.hasCombustibles) return false;
  
  // 倍数指定がある場合は比較
  if (typeof condition.value === 'number' && building.designatedCombustibles.regulatedQuantityRatio !== undefined) {
    return compareValues(building.designatedCombustibles.regulatedQuantityRatio, condition.operator, condition.value);
  }
  
  // 単純な有無判定
  return building.designatedCombustibles.hasCombustibles === condition.value;
}

/**
 * 数値比較演算子の評価
 */
function compareValues(
  actual: number,
  operator: string,
  expected: number
): boolean {
  switch (operator) {
    case '==':
      return actual === expected;
    case '!=':
      return actual !== expected;
    case '>':
      return actual > expected;
    case '>=':
      return actual >= expected;
    case '<':
      return actual < expected;
    case '<=':
      return actual <= expected;
    default:
      console.warn(`Unknown operator: ${operator}`);
      return false;
  }
}

/**
 * 複数条件の評価(AND条件)
 * 
 * @param building 建築物情報
 * @param conditions 評価する条件の配列
 * @param ruleId ルールID
 * @returns すべての条件を満たす場合true
 */
export function evaluateConditions(
  building: BuildingInfo,
  conditions: Condition[],
  ruleId?: string
): boolean {
  return conditions.every((condition) =>
    evaluateCondition(building, condition, ruleId)
  );
}
