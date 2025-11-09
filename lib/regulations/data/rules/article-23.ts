/**
 * 消防法施行令 第23条
 * 消防機関へ通報する火災報知設備
 */

import type { BuildingInfo } from '../../types';

/**
 * 第23条: 消防機関へ通報する火災報知設備の設置基準
 * 
 * 別表第一に掲げる防火対象物で、次の各号のいずれかに該当するもの
 * 
 * ただし、消防機関から著しく離れた場所その他総務省令で定める場所にある
 * 防火対象物はこの限りでない
 * 
 * 1号: (6)項イ(1)〜(3)、(6)項ロ、(16-2)項、(16-3)項 - 面積要件なし
 * 2号: (1)(2)(4)(5)イ(6)イ(4)ハニ(12)(17)項 - 延べ面積500㎡以上
 * 3号: (3)(5)ロ(7)〜(11)(13)〜(15)項 - 延べ面積1,000㎡以上
 */

/**
 * 第23条 1号: 面積要件なしで設置が必要な用途
 */
export function checkArticle23_1(building: BuildingInfo): boolean {
  const alwaysRequired = [
    '6-i-1', '6-i-2', '6-i-3', // (6)項イ(1)〜(3)
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5', // (6)項ロ
    '16-2', // (16-2)項
    '16-3', // (16-3)項
  ];

  return alwaysRequired.includes(building.usageCode);
}

/**
 * 第23条 2号: 延べ面積500㎡以上で設置が必要な用途
 */
export function checkArticle23_2(building: BuildingInfo): boolean {
  const threshold500 = [
    '1-i', '1-ro',    // (1)項
    '2-i', '2-ro', '2-ha', '2-ni', // (2)項
    '4',              // (4)項
    '5-i',            // (5)項イ
    '6-i-4',          // (6)項イ(4)
    '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', // (6)項ハ
    '6-ni',           // (6)項ニ
    '12-i', '12-ro',  // (12)項
    '17',             // (17)項
  ];

  return threshold500.includes(building.usageCode) && building.totalArea >= 500;
}

/**
 * 第23条 3号: 延べ面積1,000㎡以上で設置が必要な用途
 */
export function checkArticle23_3(building: BuildingInfo): boolean {
  const threshold1000 = [
    '3-i', '3-ro',    // (3)項
    '5-ro',           // (5)項ロ
    '7',              // (7)項
    '8',              // (8)項
    '9-i', '9-ro',    // (9)項
    '10',             // (10)項
    '11',             // (11)項
    '13-i', '13-ro',  // (13)項
    '14',             // (14)項
    '15',             // (15)項
  ];

  return threshold1000.includes(building.usageCode) && building.totalArea >= 1000;
}

/**
 * 第23条 ただし書: 消防機関から著しく離れた場所等は除外
 */
export function checkArticle23_Exception(building: BuildingInfo): boolean {
  return building.distanceFromFireStation === 'significantly-far';
}

/**
 * 第23条 統合判定
 */
export function checkArticle23(building: BuildingInfo): boolean {
  // 除外条件に該当する場合は不要
  if (checkArticle23_Exception(building)) {
    return false;
  }

  return (
    checkArticle23_1(building) ||
    checkArticle23_2(building) ||
    checkArticle23_3(building)
  );
}
