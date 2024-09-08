import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const dictNestedValue = (
  nestedObj: Record<string, any>,
  path: (string | number)[]
): any => path.reduce((acc, key) => acc && acc[key], nestedObj)
