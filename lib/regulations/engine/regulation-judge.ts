import type { BuildingInfo, InstallationRule, EquipmentType } from '../types';
import { INSTALLATION_RULES } from '../data/rules';
import { evaluateConditions } from './condition-evaluator';

/**
 * 規制判別結果
 */
export interface JudgmentResult {
  /** 建築物情報 */
  building: BuildingInfo;
  /** 必要な設備リスト */
  requiredEquipment: RequiredEquipment[];
  /** 判定日時 */
  judgedAt: Date;
}

/**
 * 必要設備情報
 */
export interface RequiredEquipment {
  /** 設備種別 */
  equipmentType: EquipmentType;
  /** 適用されたルール */
  appliedRules: AppliedRule[];
  /** 設置必須かどうか */
  isRequired: boolean;
}

/**
 * 適用ルール情報
 */
export interface AppliedRule {
  /** ルールID */
  ruleId: string;
  /** 法的根拠 */
  legalBasis: string;
  /** 優先度 */
  priority: number;
  /** 適用範囲 */
  scope: string;
  /** 備考 */
  notes: string;
}

/**
 * 規制判別エンジン
 */
export class RegulationJudge {
  private rules: InstallationRule[];

  constructor(rules: InstallationRule[] = INSTALLATION_RULES) {
    this.rules = rules;
  }

  /**
   * 建築物に必要な消防用設備を判定
   * 
   * @param building 建築物情報
   * @returns 判定結果
   */
  judge(building: BuildingInfo): JudgmentResult {
    const requiredEquipment = this.determineRequiredEquipment(building);

    return {
      building,
      requiredEquipment,
      judgedAt: new Date(),
    };
  }

  /**
   * 必要設備を判定
   */
  private determineRequiredEquipment(building: BuildingInfo): RequiredEquipment[] {
    // 設備種別ごとにグループ化
    const equipmentMap = new Map<EquipmentType, AppliedRule[]>();

    for (const rule of this.rules) {
      // 条件評価
      if (evaluateConditions(building, rule.conditions, rule.id)) {
        const appliedRule: AppliedRule = {
          ruleId: rule.id,
          legalBasis: rule.legalBasis,
          priority: rule.priority,
          scope: rule.scope || '全域',
          notes: rule.notes || '',
        };

        const existingRules = equipmentMap.get(rule.equipmentType) || [];
        existingRules.push(appliedRule);
        equipmentMap.set(rule.equipmentType, existingRules);
      }
    }

    // 設備種別ごとの結果を生成
    const requiredEquipment: RequiredEquipment[] = [];

    for (const [equipmentType, appliedRules] of equipmentMap.entries()) {
      // 優先度順にソート(降順)
      appliedRules.sort((a, b) => b.priority - a.priority);

      requiredEquipment.push({
        equipmentType,
        appliedRules,
        isRequired: appliedRules.length > 0,
      });
    }

    return requiredEquipment;
  }

  /**
   * 特定の設備が必要かどうかを判定
   * 
   * @param building 建築物情報
   * @param equipmentType 設備種別
   * @returns 必要な場合true
   */
  isEquipmentRequired(building: BuildingInfo, equipmentType: EquipmentType): boolean {
    const relevantRules = this.rules.filter(
      (rule) => rule.equipmentType === equipmentType
    );

    return relevantRules.some((rule) =>
      evaluateConditions(building, rule.conditions, rule.id)
    );
  }

  /**
   * 適用される全ルールを取得
   * 
   * @param building 建築物情報
   * @returns 適用されるルールの配列
   */
  getApplicableRules(building: BuildingInfo): InstallationRule[] {
    return this.rules.filter((rule) =>
      evaluateConditions(building, rule.conditions, rule.id)
    );
  }

  /**
   * 設備種別ごとに適用されるルールを取得
   * 
   * @param building 建築物情報
   * @param equipmentType 設備種別
   * @returns 適用されるルールの配列
   */
  getApplicableRulesByEquipment(
    building: BuildingInfo,
    equipmentType: EquipmentType
  ): InstallationRule[] {
    return this.rules.filter(
      (rule) =>
        rule.equipmentType === equipmentType &&
        evaluateConditions(building, rule.conditions, rule.id)
    );
  }
}

/**
 * デフォルトの規制判別エンジンインスタンス
 */
export const defaultJudge = new RegulationJudge();

/**
 * 簡易判定関数
 * 
 * @param building 建築物情報
 * @returns 判定結果
 */
export function judge(building: BuildingInfo): JudgmentResult {
  return defaultJudge.judge(building);
}
