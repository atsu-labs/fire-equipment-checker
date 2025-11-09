import type { EquipmentType } from '../types';

/**
 * 設備種別情報
 */
export interface EquipmentInfo {
  type: EquipmentType;
  category: '消火設備' | '警報設備' | '避難設備' | 'その他';
  legalBasis: string;
  description: string;
}

/**
 * 消防用設備種別マスタデータ
 */
export const EQUIPMENT_TYPES: Record<EquipmentType, EquipmentInfo> = {
  消火器: {
    type: '消火器',
    category: '消火設備',
    legalBasis: '令第10条',
    description: 'すべての防火対象物に設置義務がある基本的な消火設備',
  },
  屋内消火栓設備: {
    type: '屋内消火栓設備',
    category: '消火設備',
    legalBasis: '令第11条',
    description: '建物内部に設置される消火栓設備。1号・2号・易操作性1号がある',
  },
  スプリンクラー設備: {
    type: 'スプリンクラー設備',
    category: '消火設備',
    legalBasis: '令第12条',
    description: '天井から自動散水する消火設備。特定用途や高層建築物に必要',
  },
  水噴霧消火設備: {
    type: '水噴霧消火設備',
    category: '消火設備',
    legalBasis: '令第13条',
    description: '水を霧状に噴霧する消火設備。駐車場、ヘリポート等で使用',
  },
  泡消火設備: {
    type: '泡消火設備',
    category: '消火設備',
    legalBasis: '令第13条',
    description: '泡を放出する消火設備。駐車場、ヘリポート、道路用部分等で使用',
  },
  不活性ガス消火設備: {
    type: '不活性ガス消火設備',
    category: '消火設備',
    legalBasis: '令第13条',
    description: '窒素、二酸化炭素等の不活性ガスを放出する消火設備。電気設備室等で使用',
  },
  ハロゲン化物消火設備: {
    type: 'ハロゲン化物消火設備',
    category: '消火設備',
    legalBasis: '令第13条',
    description: 'ハロゲン化物を放出する消火設備。電気設備室、通信機器室等で使用',
  },
  粉末消火設備: {
    type: '粉末消火設備',
    category: '消火設備',
    legalBasis: '令第13条',
    description: '粉末薬剤を放出する消火設備。電気設備室、多量火気使用部分等で使用',
  },
  屋外消火栓設備: {
    type: '屋外消火栓設備',
    category: '消火設備',
    legalBasis: '令第19条',
    description: '建物外部に設置される消火栓設備。大規模建築物で必要',
  },
  自動火災報知設備: {
    type: '自動火災報知設備',
    category: '警報設備',
    legalBasis: '令第21条',
    description: '火災を自動的に感知して警報を発する設備。P型・R型がある',
  },
  ガス漏れ火災警報設備: {
    type: 'ガス漏れ火災警報設備',
    category: '警報設備',
    legalBasis: '令第21条の2',
    description: '温泉採取設備や地下街等に設置。可燃性ガスの漏洩を検知して警報を発する',
  },
  漏電火災警報器: {
    type: '漏電火災警報器',
    category: '警報設備',
    legalBasis: '令第22条',
    description: '漏電による火災を予防するための警報器',
  },
  非常警報設備: {
    type: '非常警報設備',
    category: '警報設備',
    legalBasis: '令第24条',
    description: '非常警報器具、非常ベル、放送設備等。収容人員により種別が異なる',
  },
  消防機関へ通報する火災報知設備: {
    type: '消防機関へ通報する火災報知設備',
    category: '警報設備',
    legalBasis: '令第23条',
    description: '火災発生を自動的に消防機関に通報する設備。用途と延べ面積により設置義務',
  },
  避難器具: {
    type: '避難器具',
    category: '避難設備',
    legalBasis: '令第25条',
    description:
      '避難はしご、救助袋、緩降機等の避難用器具。2階以上の建物で必要',
  },
  誘導灯: {
    type: '誘導灯',
    category: '避難設備',
    legalBasis: '令第26条',
    description: '避難口や避難経路を示す照明設備。A級・B級・C級がある',
  },
  誘導標識: {
    type: '誘導標識',
    category: '避難設備',
    legalBasis: '令第26条',
    description: '避難口や避難経路を示す標識',
  },
  消防用水: {
    type: '消防用水',
    category: 'その他',
    legalBasis: '令第27条',
    description: '消防活動に必要な水利。一定規模以上の建物で必要',
  },
  排煙設備: {
    type: '排煙設備',
    category: 'その他',
    legalBasis: '令第29条の3',
    description: '火災時の煙を排出する設備。特定用途や一定規模以上で必要',
  },
  連結送水管: {
    type: '連結送水管',
    category: 'その他',
    legalBasis: '令第28条、令第29条',
    description:
      '消防隊が消火活動に使用する配管設備。高層建築物や地階で必要',
  },
  連結散水設備: {
    type: '連結散水設備',
    category: 'その他',
    legalBasis: '令第28条の2',
    description: '地下街等で消防隊が使用する散水設備',
  },
  非常コンセント設備: {
    type: '非常コンセント設備',
    category: 'その他',
    legalBasis: '令第29条の2',
    description: '消防隊が電動工具等を使用するための電源設備',
  },
  無線通信補助設備: {
    type: '無線通信補助設備',
    category: 'その他',
    legalBasis: '令第29条の4',
    description: '地階等で消防隊の無線通信を可能にする設備',
  },
} as const;

/**
 * カテゴリ別の設備一覧
 */
export const EQUIPMENT_BY_CATEGORY = {
  消火設備: ['消火器', '屋内消火栓設備', 'スプリンクラー設備'] as EquipmentType[],
  警報設備: [
    '自動火災報知設備',
    'ガス漏れ火災警報設備',
    '漏電火災警報器',
    '非常警報設備',
    '消防機関へ通報する火災報知設備',
  ] as EquipmentType[],
  避難設備: ['避難器具', '誘導灯', '誘導標識'] as EquipmentType[],
  その他: [
    '消防用水',
    '排煙設備',
    '連結送水管',
    '連結散水設備',
    '非常コンセント設備',
    '無線通信補助設備',
  ] as EquipmentType[],
} as const;

/**
 * 設備情報を取得
 */
export function getEquipmentInfo(type: EquipmentType): EquipmentInfo {
  return EQUIPMENT_TYPES[type];
}

/**
 * カテゴリ別の設備一覧を取得
 */
export function getEquipmentsByCategory(
  category: '消火設備' | '警報設備' | '避難設備' | 'その他'
): EquipmentType[] {
  return EQUIPMENT_BY_CATEGORY[category];
}
