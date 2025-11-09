/**
 * 消防法施行令 第22条
 * 漏電火災警報器
 */

import type { BuildingInfo } from '../../types';

/**
 * 第22条: 漏電火災警報器の設置基準
 * 
 * 次の各号に掲げる防火対象物の区分に応じ、当該各号に定める部分
 * 
 * 1号〜6号: 用途・面積により異なる
 * 7号: 契約電流容量が50アンペアを超えるもの
 */

/**
 * 第22条 1号: (1)項 - 劇場、映画館等（300㎡以上）
 */
export function checkArticle22_1(building: BuildingInfo): boolean {
  return building.usageCode === '1-i' && building.totalArea >= 300;
}

/**
 * 第22条 2号: (2)項 - キャバレー、ナイトクラブ等（500㎡以上）
 */
export function checkArticle22_2(building: BuildingInfo): boolean {
  const usageCodes = ['2-i', '2-ro', '2-ha'];
  return usageCodes.includes(building.usageCode) && building.totalArea >= 500;
}

/**
 * 第22条 3号: (3)項、(4)項 - 料理店、飲食店、百貨店等（500㎡以上）
 */
export function checkArticle22_3(building: BuildingInfo): boolean {
  const usageCodes = ['3-i', '3-ro', '4'];
  return usageCodes.includes(building.usageCode) && building.totalArea >= 500;
}

/**
 * 第22条 4号: (5)項イ - ホテル、旅館等（500㎡以上）
 */
export function checkArticle22_4(building: BuildingInfo): boolean {
  return building.usageCode === '5-i' && building.totalArea >= 500;
}

/**
 * 第22条 5号: (6)項 - 病院、福祉施設等（300㎡以上）
 */
export function checkArticle22_5(building: BuildingInfo): boolean {
  const usageCodes = [
    '6-i-1', '6-i-2', '6-i-3', '6-i-4',
    '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
    '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
  ];
  return usageCodes.includes(building.usageCode) && building.totalArea >= 300;
}

/**
 * 第22条 6号: (16)項イ - 複合用途で特定用途部分が300㎡以上
 * 
 * ※(16)項イの場合、各特定用途の合計面積で判定
 */
export function checkArticle22_6(building: BuildingInfo): boolean {
  if (building.usageCode !== '16-i') {
    return false;
  }

  // floorUsageDetailsから特定用途の合計面積を計算
  if (building.floorUsageDetails && building.floorUsageDetails.length > 0) {
    const specificUsages = [
      '1-i', '1-ro', '2-i', '2-ro', '2-ha', '3-i', '3-ro', '4',
      '5-i', '6-i-1', '6-i-2', '6-i-3', '6-i-4',
      '6-ro-1', '6-ro-2', '6-ro-3', '6-ro-4', '6-ro-5',
      '6-ha-1', '6-ha-2', '6-ha-3', '6-ha-4', '6-ha-5', '6-ni',
      '9-i',
    ];

    const specificArea = building.floorUsageDetails
      .filter(d => specificUsages.includes(d.usageCode))
      .reduce((sum, d) => sum + d.area, 0);

    return specificArea >= 300;
  }

  // 簡易入力の場合は総面積で判定（暫定）
  return building.totalArea >= 300;
}

/**
 * 第22条 7号: 契約電流容量が50アンペアを超えるもの
 * 
 * 準不燃材料以外の鉄網入りガラス、準不燃材料以外の材料で造った壁・床・天井がある場合
 */
export function checkArticle22_7(building: BuildingInfo): boolean {
  // 契約電流容量が50Aを超える
  const exceedsCurrentCapacity = 
    (building.contractedCurrentCapacity || 0) > 50 ||
    (building.maxContractedCurrent || 0) > 50;

  // 鉄網入り壁・床・天井（準不燃材料以外）がある
  const hasWireNet = building.hasWireNetConstruction || false;

  return exceedsCurrentCapacity && hasWireNet;
}

/**
 * 第22条 統合判定
 */
export function checkArticle22(building: BuildingInfo): boolean {
  return (
    checkArticle22_1(building) ||
    checkArticle22_2(building) ||
    checkArticle22_3(building) ||
    checkArticle22_4(building) ||
    checkArticle22_5(building) ||
    checkArticle22_6(building) ||
    checkArticle22_7(building)
  );
}
