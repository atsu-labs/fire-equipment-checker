import type { UsageCode, UsageType } from '../types';

/**
 * 消防法施行令別表第一 用途分類マスタデータ
 * 
 * 基準法令: 消防法施行令別表第一(令和7年10月1日施行版)
 * 全47用途コード
 */
export const USAGE_TYPES: Record<UsageCode, UsageType> = {
  '1-i': {
    code: '1-i',
    name: '劇場、映画館、演芸場又は観覧場',
    isSpecific: true,
    category: '(一)項',
    legalReference: '令別表第一(一)項イ',
  },
  '1-ro': {
    code: '1-ro',
    name: '公会堂又は集会場',
    isSpecific: true,
    category: '(一)項',
    legalReference: '令別表第一(一)項ロ',
  },
  '2-i': {
    code: '2-i',
    name: 'キャバレー、カフェー、ナイトクラブ等',
    isSpecific: true,
    category: '(二)項',
    legalReference: '令別表第一(二)項イ',
  },
  '2-ro': {
    code: '2-ro',
    name: '遊技場又はダンスホール',
    isSpecific: true,
    category: '(二)項',
    legalReference: '令別表第一(二)項ロ',
  },
  '2-ha': {
    code: '2-ha',
    name: '性風俗関連特殊営業店舗等',
    isSpecific: true,
    category: '(二)項',
    legalReference: '令別表第一(二)項ハ',
  },
  '2-ni': {
    code: '2-ni',
    name: 'カラオケボックス等',
    isSpecific: true,
    category: '(二)項',
    legalReference: '令別表第一(二)項ニ',
  },
  '3-i': {
    code: '3-i',
    name: '待合、料理店等',
    isSpecific: true,
    category: '(三)項',
    legalReference: '令別表第一(三)項イ',
  },
  '3-ro': {
    code: '3-ro',
    name: '飲食店',
    isSpecific: true,
    category: '(三)項',
    legalReference: '令別表第一(三)項ロ',
  },
  '4': {
    code: '4',
    name: '百貨店、マーケット等',
    isSpecific: true,
    category: '(四)項',
    legalReference: '令別表第一(四)項',
  },
  '5-i': {
    code: '5-i',
    name: '旅館、ホテル、宿泊所等',
    isSpecific: true,
    category: '(五)項',
    legalReference: '令別表第一(五)項イ',
  },
  '5-ro': {
    code: '5-ro',
    name: '寄宿舎、下宿又は共同住宅',
    isSpecific: false,
    category: '(五)項',
    legalReference: '令別表第一(五)項ロ',
  },
  '6-i-1': {
    code: '6-i-1',
    name: '病院(特定診療科・療養病床等)',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項イ(1)',
  },
  '6-i-2': {
    code: '6-i-2',
    name: '診療所(特定診療科・4人以上入院)',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項イ(2)',
  },
  '6-i-3': {
    code: '6-i-3',
    name: '病院、有床診療所、入所助産所',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項イ(3)',
  },
  '6-i-4': {
    code: '6-i-4',
    name: '無床診療所、無入所助産所',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項イ(4)',
  },
  '6-ro-1': {
    code: '6-ro-1',
    name: '特養、老人短期入所施設等(避難困難)',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項ロ(1)',
  },
  '6-ro-2': {
    code: '6-ro-2',
    name: '救護施設',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項ロ(2)',
  },
  '6-ro-3': {
    code: '6-ro-3',
    name: '乳児院',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項ロ(3)',
  },
  '6-ro-4': {
    code: '6-ro-4',
    name: '障害児入所施設',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項ロ(4)',
  },
  '6-ro-5': {
    code: '6-ro-5',
    name: '障害者支援施設等(避難困難)',
    isSpecific: true,
    category: '(六)項',
    legalReference: '令別表第一(六)項ロ(5)',
  },
  '6-ha-1': {
    code: '6-ha-1',
    name: '老人デイサービスセンター、有料老人ホーム等',
    isSpecific: false,
    category: '(六)項',
    legalReference: '令別表第一(六)項ハ(1)',
  },
  '6-ha-2': {
    code: '6-ha-2',
    name: '更生施設',
    isSpecific: false,
    category: '(六)項',
    legalReference: '令別表第一(六)項ハ(2)',
  },
  '6-ha-3': {
    code: '6-ha-3',
    name: '保育所、幼保連携型認定こども園等',
    isSpecific: false,
    category: '(六)項',
    legalReference: '令別表第一(六)項ハ(3)',
  },
  '6-ha-4': {
    code: '6-ha-4',
    name: '児童発達支援センター等',
    isSpecific: false,
    category: '(六)項',
    legalReference: '令別表第一(六)項ハ(4)',
  },
  '6-ha-5': {
    code: '6-ha-5',
    name: '身体障害者福祉センター、障害者支援施設等',
    isSpecific: false,
    category: '(六)項',
    legalReference: '令別表第一(六)項ハ(5)',
  },
  '6-ni': {
    code: '6-ni',
    name: '幼稚園又は特別支援学校',
    isSpecific: false,
    category: '(六)項',
    legalReference: '令別表第一(六)項ニ',
  },
  '7': {
    code: '7',
    name: '小中高大学等',
    isSpecific: false,
    category: '(七)項',
    legalReference: '令別表第一(七)項',
  },
  '8': {
    code: '8',
    name: '図書館、博物館、美術館等',
    isSpecific: false,
    category: '(八)項',
    legalReference: '令別表第一(八)項',
  },
  '9-i': {
    code: '9-i',
    name: '蒸気浴場、熱気浴場等',
    isSpecific: true,
    category: '(九)項',
    legalReference: '令別表第一(九)項イ',
  },
  '9-ro': {
    code: '9-ro',
    name: 'その他の公衆浴場',
    isSpecific: false,
    category: '(九)項',
    legalReference: '令別表第一(九)項ロ',
  },
  '10': {
    code: '10',
    name: '車両停車場、船舶・航空機発着場',
    isSpecific: false,
    category: '(十)項',
    legalReference: '令別表第一(十)項',
  },
  '11': {
    code: '11',
    name: '神社、寺院、教会等',
    isSpecific: false,
    category: '(十一)項',
    legalReference: '令別表第一(十一)項',
  },
  '12-i': {
    code: '12-i',
    name: '工場又は作業場',
    isSpecific: false,
    category: '(十二)項',
    legalReference: '令別表第一(十二)項イ',
  },
  '12-ro': {
    code: '12-ro',
    name: '映画スタジオ又はテレビスタジオ',
    isSpecific: false,
    category: '(十二)項',
    legalReference: '令別表第一(十二)項ロ',
  },
  '13-i': {
    code: '13-i',
    name: '自動車車庫又は駐車場',
    isSpecific: false,
    category: '(十三)項',
    legalReference: '令別表第一(十三)項イ',
  },
  '13-ro': {
    code: '13-ro',
    name: '飛行機・回転翼航空機の格納庫',
    isSpecific: false,
    category: '(十三)項',
    legalReference: '令別表第一(十三)項ロ',
  },
  '14': {
    code: '14',
    name: '倉庫',
    isSpecific: false,
    category: '(十四)項',
    legalReference: '令別表第一(十四)項',
  },
  '15': {
    code: '15',
    name: '前各項に該当しない事業場',
    isSpecific: false,
    category: '(十五)項',
    legalReference: '令別表第一(十五)項',
  },
  '16-i': {
    code: '16-i',
    name: '複合用途(特定用途含む)',
    isSpecific: true,
    category: '(十六)項',
    legalReference: '令別表第一(十六)項イ',
  },
  '16-ro': {
    code: '16-ro',
    name: '複合用途(その他)',
    isSpecific: false,
    category: '(十六)項',
    legalReference: '令別表第一(十六)項ロ',
  },
  '16-2': {
    code: '16-2',
    name: '地下街',
    isSpecific: true,
    category: '(十六の二)項',
    legalReference: '令別表第一(十六の二)項',
  },
  '16-3': {
    code: '16-3',
    name: '準地下街',
    isSpecific: true,
    category: '(十六の三)項',
    legalReference: '令別表第一(十六の三)項',
  },
  '17': {
    code: '17',
    name: '重要文化財等',
    isSpecific: false,
    category: '(十七)項',
    legalReference: '令別表第一(十七)項',
  },
  '18': {
    code: '18',
    name: '延長50m以上のアーケード',
    isSpecific: false,
    category: '(十八)項',
    legalReference: '令別表第一(十八)項',
  },
  '19': {
    code: '19',
    name: '市町村長指定山林',
    isSpecific: false,
    category: '(十九)項',
    legalReference: '令別表第一(十九)項',
  },
  '20': {
    code: '20',
    name: '総務省令で定める舟車',
    isSpecific: false,
    category: '(二十)項',
    legalReference: '令別表第一(二十)項',
  },
} as const;

/**
 * 特定用途のコード一覧
 */
export const SPECIFIC_USAGE_CODES: UsageCode[] = Object.values(USAGE_TYPES)
  .filter(usage => usage.isSpecific)
  .map(usage => usage.code);

/**
 * 非特定用途のコード一覧
 */
export const NON_SPECIFIC_USAGE_CODES: UsageCode[] = Object.values(USAGE_TYPES)
  .filter(usage => !usage.isSpecific)
  .map(usage => usage.code);

/**
 * (六)項の医療・福祉施設コード一覧
 */
export const HEALTHCARE_FACILITY_CODES: UsageCode[] = [
  '6-i-1',
  '6-i-2',
  '6-i-3',
  '6-i-4',
  '6-ro-1',
  '6-ro-2',
  '6-ro-3',
  '6-ro-4',
  '6-ro-5',
  '6-ha-1',
  '6-ha-2',
  '6-ha-3',
  '6-ha-4',
  '6-ha-5',
  '6-ni',
];

/**
 * (六)項イ・ロの避難困難者施設コード一覧
 */
export const EVACUATION_DIFFICULTY_CODES: UsageCode[] = [
  '6-i-1',
  '6-i-2',
  '6-i-3',
  '6-i-4',
  '6-ro-1',
  '6-ro-2',
  '6-ro-3',
  '6-ro-4',
  '6-ro-5',
];

/**
 * 用途コードから用途情報を取得
 */
export function getUsageType(code: UsageCode): UsageType {
  return USAGE_TYPES[code];
}

/**
 * 用途コードが特定用途かどうか判定
 */
export function isSpecificUsage(code: UsageCode): boolean {
  return USAGE_TYPES[code].isSpecific;
}

/**
 * 用途コードが医療・福祉施設かどうか判定
 */
export function isHealthcareFacility(code: UsageCode): boolean {
  return HEALTHCARE_FACILITY_CODES.includes(code);
}

/**
 * 用途コードが避難困難者施設かどうか判定
 */
export function hasEvacuationDifficulty(code: UsageCode): boolean {
  return EVACUATION_DIFFICULTY_CODES.includes(code);
}
