import type { UsageType } from '@/lib/regulations/types';

type UsageTypesMap = Record<string, UsageType>;

export type UsageOption = {
  code: string;
  label: string;
};

/**
 * Group usage types by their category label (e.g., '(一)項').
 * Returns an object where keys are category labels and values are arrays of { code, label }.
 */
export function groupUsageTypes(usages: UsageTypesMap): Record<string, UsageOption[]> {
  const groups: Record<string, UsageOption[]> = {};

  Object.values(usages).forEach(u => {
    const cat = u.category || 'その他';
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push({ code: u.code, label: `${u.name} ${u.legalReference ?? ''}`.trim() });
  });

  // Optionally sort groups by label and options by code to keep deterministic order
  Object.keys(groups).forEach(k => {
    groups[k].sort((a, b) => a.code.localeCompare(b.code));
  });

  return groups;
}

export default groupUsageTypes;
