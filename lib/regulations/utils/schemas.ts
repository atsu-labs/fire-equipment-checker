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
