import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Tailwind CSSクラス名をマージする
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
