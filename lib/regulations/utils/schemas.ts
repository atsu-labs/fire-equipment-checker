import { z } from 'zod';

/**
 * 用途コードの検証スキーマ
 */
export const usageCodeSchema = z.enum([
  '1-i',
  '1-ro',
  '2-i',
  '2-ro',
  '2-ha',
  '2-ni',
  '3-i',
  '3-ro',
  '4',
  '5-i',
  '5-ro',
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
  '7',
  '8',
  '9-i',
  '9-ro',
  '10',
  '11',
  '12-i',
  '12-ro',
  '13-i',
  '13-ro',
  '14',
  '15',
  '16-i',
  '16-ro',
  '16-2',
  '16-3',
  '17',
  '18',
  '19',
  '20',
]);

/**
 * 建築物情報の検証スキーマ
 */
export const buildingInfoSchema = z.object({
  usageCode: usageCodeSchema,
  totalArea: z
    .number()
    .positive({ message: '延床面積は正の数である必要があります' })
    .max(1000000, { message: '延床面積は1,000,000㎡以下である必要があります' }),
  floors: z
    .number()
    .int({ message: '階数は整数である必要があります' })
    .positive({ message: '階数は正の数である必要があります' })
    .max(200, { message: '階数は200階以下である必要があります' }),
  undergroundFloors: z
    .number()
    .int({ message: '地階数は整数である必要があります' })
    .nonnegative({ message: '地階数は0以上である必要があります' })
    .max(20, { message: '地階数は20階以下である必要があります' }),
  capacity: z
    .number()
    .int({ message: '収容人員は整数である必要があります' })
    .nonnegative({ message: '収容人員は0以上である必要があります' })
    .optional(),
  height: z
    .number()
    .positive({ message: '高さは正の数である必要があります' })
    .max(1000, { message: '高さは1,000m以下である必要があります' })
    .optional(),
  hasBasement: z.boolean().optional(),
  basementArea: z
    .number()
    .nonnegative({ message: '地階面積は0以上である必要があります' })
    .optional(),
  fireResistantStructure: z.boolean().optional(),
});

/**
 * フォーム入力用の建築物情報スキーマ
 * 文字列入力を数値に変換
 */
export const buildingInfoFormSchema = z.object({
  usageCode: usageCodeSchema,
  totalArea: z.string().transform((val, ctx) => {
    const parsed = parseFloat(val);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '延床面積は数値で入力してください',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  floors: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '階数は整数で入力してください',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  undergroundFloors: z.string().transform((val, ctx) => {
    const parsed = parseInt(val, 10);
    if (isNaN(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '地階数は整数で入力してください',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  capacity: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val || val === '') return undefined;
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '収容人員は整数で入力してください',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  height: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val || val === '') return undefined;
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '高さは数値で入力してください',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  hasBasement: z.boolean().optional(),
  basementArea: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (!val || val === '') return undefined;
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '地階面積は数値で入力してください',
        });
        return z.NEVER;
      }
      return parsed;
    }),
  fireResistantStructure: z.boolean().optional(),
});

export type BuildingInfoInput = z.infer<typeof buildingInfoSchema>;
export type BuildingInfoFormInput = z.input<typeof buildingInfoFormSchema>;

/**
 * 階別用途詳細スキーマ（フォーム入力）
 */
export const floorUsageDetailFormSchema = z.object({
  floor: z.string().transform((val, ctx) => {
    // 地階は負の数を許可。小数が含まれる場合はエラーにする
    const parsed = parseFloat(val);
    if (isNaN(parsed) || !Number.isFinite(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '階は整数で入力してください',
      });
      return z.NEVER;
    }
    if (!Number.isInteger(parsed)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: '階は整数である必要があります',
      });
      return z.NEVER;
    }
    return parsed;
  }),
  usageCode: usageCodeSchema,
  area: z
    .string()
    .transform((val, ctx) => {
      const parsed = parseFloat(val);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '床面積は数値で入力してください',
        });
        return z.NEVER;
      }
      // 小数第2位までを許容
      const multiplied = Math.round(parsed * 100) / 100;
      return multiplied;
    })
    .refine(n => n > 0, { message: '床面積は正の数である必要があります' })
    .refine(n => n <= 100000, { message: '床面積は100,000㎡以下である必要があります' }),
  capacity: z
    .string()
    .optional()
    .transform((val, ctx) => {
      if (val === undefined || val === '') return undefined;
      const parsed = parseInt(val as string, 10);
      if (isNaN(parsed)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: '収容人員は整数で入力してください',
        });
        return z.NEVER;
      }
      return parsed;
    })
    .refine(v => v === undefined || v >= 0, { message: '収容人員は0以上である必要があります' }),
  attributes: z
    .object({
      noWindow: z.boolean().optional(),
      evacuationFloor: z.boolean().optional(),
      directStairCount: z.number().int().nonnegative().optional(),
    })
    .optional(),
});

/**
 * 拡張された建築物フォームスキーマ（floorUsageDetails を含む）
 */
export const buildingInfoFormSchemaExtended = z
  .object({
    usageCode: usageCodeSchema,
    totalArea: z
      .string()
      .transform((val, ctx) => {
        const parsed = parseFloat(val);
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '延床面積は数値で入力してください',
          });
          return z.NEVER;
        }
        // 小数第2位まで
        return Math.round(parsed * 100) / 100;
      })
      .refine(n => n > 0, { message: '延床面積は正の数である必要があります' })
      .refine(n => n <= 1000000, { message: '延床面積は1,000,000㎡以下である必要があります' }),
    floors: z
      .string()
      .transform((val, ctx) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '階数は整数で入力してください',
          });
          return z.NEVER;
        }
        return parsed;
      })
      .refine(n => Number.isInteger(n), { message: '階数は整数である必要があります' })
      .refine(n => n >= 0 && n <= 200, { message: '階数は0〜200の間である必要があります' }),
    undergroundFloors: z
      .string()
      .transform((val, ctx) => {
        const parsed = parseInt(val, 10);
        if (isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: '地階数は整数で入力してください',
          });
          return z.NEVER;
        }
        return parsed;
      })
      .refine(n => n >= 0 && n <= 20, { message: '地階数は0〜20の間である必要があります' }),
    floorUsageDetails: z
      .array(floorUsageDetailFormSchema)
      .optional()
      .refine(arr => arr === undefined || arr.length <= 1000, {
        message: '階別用途詳細の行数が多すぎます',
      }),
  })
  .superRefine((val, ctx) => {
    // 複合用途(16系)の場合、floorUsageDetails が必須
    if (val.usageCode.startsWith('16')) {
      if (!val.floorUsageDetails || val.floorUsageDetails.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['floorUsageDetails'],
          message: '複合用途を選択した場合、階別用途詳細を入力してください',
        });
      }
    }

    // 小数第2位チェックは既に丸めているが、入力の桁数制御を別途検証する
  });

export type BuildingInfoFormExtendedInput = z.input<typeof buildingInfoFormSchemaExtended>;
