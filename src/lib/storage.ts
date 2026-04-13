import { Transaction } from '@/types'

const MONTHS_INDEX_KEY = 'kakeibo_months'

function storageKey(ym: string): string {
  return `kakeibo_transactions_${ym}`
}

function monthKeyFromDate(date: string): string {
  return date.slice(0, 7)
}

function loadMonthsIndex(): string[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(MONTHS_INDEX_KEY) ?? '[]')
  } catch {
    return []
  }
}

function saveMonthsIndex(months: string[]): void {
  localStorage.setItem(MONTHS_INDEX_KEY, JSON.stringify(months))
}

export function getTransactionsByMonth(ym: string): Transaction[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(storageKey(ym)) ?? '[]')
  } catch {
    return []
  }
}

export function getAllMonths(): string[] {
  return loadMonthsIndex().sort((a, b) => b.localeCompare(a))
}

export function saveTransaction(tx: Transaction): void {
  const ym = monthKeyFromDate(tx.date)
  const existing = getTransactionsByMonth(ym)
  existing.push(tx)
  localStorage.setItem(storageKey(ym), JSON.stringify(existing))

  const months = loadMonthsIndex()
  if (!months.includes(ym)) {
    months.push(ym)
    saveMonthsIndex(months)
  }
}

export function deleteTransaction(id: string, date: string): void {
  const ym = monthKeyFromDate(date)
  const existing = getTransactionsByMonth(ym)
  const updated = existing.filter((tx) => tx.id !== id)
  localStorage.setItem(storageKey(ym), JSON.stringify(updated))

  if (updated.length === 0) {
    const months = loadMonthsIndex().filter((m) => m !== ym)
    saveMonthsIndex(months)
  }
}

export function updateTransaction(tx: Transaction): void {
  const ym = monthKeyFromDate(tx.date)
  const existing = getTransactionsByMonth(ym)
  const updated = existing.map((t) => (t.id === tx.id ? tx : t))
  localStorage.setItem(storageKey(ym), JSON.stringify(updated))
}
