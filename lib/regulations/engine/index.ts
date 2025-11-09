/**
 * 消防用設備規制判別エンジン
 * 
 * 建築物情報から必要な消防用設備を判定するエンジン
 */

export {
  evaluateCondition,
  evaluateConditions,
} from './condition-evaluator';

export {
  RegulationJudge,
  defaultJudge,
  judge,
  type JudgmentResult,
  type RequiredEquipment,
  type AppliedRule,
} from './regulation-judge';
