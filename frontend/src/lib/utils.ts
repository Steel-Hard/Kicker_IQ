import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDelta(value: number): string {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1).replace('.', ',')}%`
}

export function formatNumber(value: number, decimals = 1): string {
  return value.toFixed(decimals).replace('.', ',')
}
