import type { InstallationRule } from '../../types';

// 各条文ルールをインポート
export { FIRE_EXTINGUISHER_RULES } from './article-10';
export { INDOOR_HYDRANT_RULES } from './article-11';
export { SPRINKLER_RULES } from './article-12';
export * from './article-13'; // 水噴霧消火設備等
export * from './article-19'; // 屋外消火栓設備
export { FIRE_ALARM_RULES } from './article-21';
export * from './article-21-2'; // 自動火災報知設備
export * from './article-22'; // 漏電火災警報器
export * from './article-23'; // 非常警報設備
export * from './article-24'; // 非常警報器具
export { EVACUATION_RULES } from './article-25';
export { GUIDE_LIGHT_RULES } from './article-26';
export * from './article-27'; // 消防用水
export * from './article-28'; // 連結送水管
export * from './article-28-2'; // 連結散水設備
export { STANDPIPE_RULES } from './article-29';
export { EMERGENCY_OUTLET_RULES } from './article-29-2';
export * from './article-29-3'; // 排煙設備

import { FIRE_EXTINGUISHER_RULES } from './article-10';
import { INDOOR_HYDRANT_RULES } from './article-11';
import { SPRINKLER_RULES } from './article-12';
import { FIRE_ALARM_RULES } from './article-21';
import { EVACUATION_RULES } from './article-25';
import { GUIDE_LIGHT_RULES } from './article-26';
import { STANDPIPE_RULES } from './article-29';
import { EMERGENCY_OUTLET_RULES } from './article-29-2';

/**
 * 全設備設置基準ルールの統合配列
 * 消防法施行令(令和7年10月1日施行)に基づく
 * 
 * 総ルール数: 64
 * - 消火器: 9ルール(令第10条)
 * - 屋内消火栓: 12ルール(令第11条)
 * - スプリンクラー: 20ルール(令第12条)
 * - 水噴霧消火設備等: 9号分(令第13条) ※関数ベース
 * - 屋外消火栓設備: 2号分(令第19条) ※関数ベース
 * - 自動火災報知: 15ルール(令第21条)
 * - 自動火災報知設備: 3号分(令第21条の2) ※関数ベース
 * - 漏電火災警報器: 7号分(令第22条) ※関数ベース
 * - 非常警報設備: 2号分(令第23条) ※関数ベース
 * - 非常警報器具: 3項分(令第24条) ※関数ベース
 * - 避難器具: 4ルール(令第25条)
 * - 誘導灯: 1ルール(令第26条)
 * - 消防用水: 2号分(令第27条) ※関数ベース
 * - 連結送水管: 3号分(令第28条) ※関数ベース
 * - 連結散水設備: 1条(令第28条の2) ※関数ベース
 * - 連結送水管: 2ルール(令第29条)
 * - 非常コンセント: 1ルール(令第29条の2)
 * - 排煙設備: 2号分(令第29条の3) ※関数ベース
 * 
 * 優先度(priority):
 * - 100: 最優先(無条件設置・避難困難施設)
 * - 90-99: 高優先度(階数・特殊用途)
 * - 80-89: 中優先度(面積基準)
 * - 70-79: 低優先度(補助基準)
 */
export const INSTALLATION_RULES: InstallationRule[] = [
  ...FIRE_EXTINGUISHER_RULES,
  ...INDOOR_HYDRANT_RULES,
  ...SPRINKLER_RULES,
  ...FIRE_ALARM_RULES,
  ...EVACUATION_RULES,
  ...GUIDE_LIGHT_RULES,
  ...STANDPIPE_RULES,
  ...EMERGENCY_OUTLET_RULES,
];

/**
 * 設備種別でルールをフィルタ
 */
export function getRulesByEquipmentType(equipmentType: string): InstallationRule[] {
  return INSTALLATION_RULES.filter((rule) => rule.equipmentType === equipmentType);
}

/**
 * ルールIDで特定のルールを取得
 */
export function getRuleById(ruleId: string): InstallationRule | undefined {
  return INSTALLATION_RULES.find((rule) => rule.id === ruleId);
}
