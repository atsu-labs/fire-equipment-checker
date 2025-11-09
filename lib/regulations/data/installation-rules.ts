/**
 * 設備設置基準ルール
 * 
 * このファイルは後方互換性のため残されています。
 * 新しいコードでは l@workspace /uiux-designer Fire Equipment Checkerアプリのワイヤーフレームとデザインシステムを作成してib/regulations/data/rules/ 配下の各ファイルを使用してください。
 * 
 * @deprecated lib/regulations/data/rules/index.ts から INSTALLATION_RULES をインポートしてください
 */

// 後方互換性のため、新しい構造からエクスポート
export {
  INSTALLATION_RULES,
  getRulesByEquipmentType,
  getRuleById,
  // 個別ルールも再エクスポート
  FIRE_EXTINGUISHER_RULES,
  INDOOR_HYDRANT_RULES,
  SPRINKLER_RULES,
  FIRE_ALARM_RULES,
  EVACUATION_RULES,
  GUIDE_LIGHT_RULES,
  STANDPIPE_RULES,
  EMERGENCY_OUTLET_RULES,
} from './rules';

// 以下は削除予定（既存コードとの互換性のため一時的に残す）
export const LEGACY_INSTALLATION_RULES = [
  // このファイルの内容は rules/ ディレクトリに移動しました
];

