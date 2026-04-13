import { Category, CategorySummary, MonthSummary, Transaction } from '@/types'
import { CATEGORIES } from './categories'

export function formatCurrency(amount: number): string {
  return `¥${amount.toLocaleString('ja-JP')}`
}

export function formatDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  return `${year}年${parseInt(month)}月${parseInt(day)}日`
}

export function formatMonthLabel(ym: string): string {
  const [year, month] = ym.split('-')
  return `${year}年${parseInt(month)}月`
}

export function getCurrentMonthKey(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function getPreviousMonth(ym: string): string {
  const [year, month] = ym.split('-').map(Number)
  const d = new Date(year, month - 2, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function getTodayString(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function computeMonthSummary(transactions: Transaction[], monthKey: string): MonthSummary {
  const categoryTotals: Record<Category, { total: number; count: number }> = {} as Record<
    Category,
    { total: number; count: number }
  >
  for (const cat of CATEGORIES) {
    categoryTotals[cat] = { total: 0, count: 0 }
  }

  let totalSpend = 0
  for (const tx of transactions) {
    for (const item of tx.items) {
      const amount = item.price * item.quantity
      categoryTotals[item.category].total += amount
      categoryTotals[item.category].count += 1
      totalSpend += amount
    }
  }

  const categories: CategorySummary[] = CATEGORIES.map((cat) => ({
    category: cat,
    total: categoryTotals[cat].total,
    count: categoryTotals[cat].count,
    percentage: totalSpend > 0 ? (categoryTotals[cat].total / totalSpend) * 100 : 0,
  })).sort((a, b) => b.total - a.total)

  return {
    monthKey,
    totalSpend,
    categories,
    transactionCount: transactions.length,
  }
}

export function computeCategoryDelta(
  current: number,
  previous: number
): { amount: number; percentage: number | null; isNew: boolean } {
  if (previous === 0 && current > 0) {
    return { amount: current, percentage: null, isNew: true }
  }
  if (previous === 0) {
    return { amount: 0, percentage: null, isNew: false }
  }
  const amount = current - previous
  const percentage = (amount / previous) * 100
  return { amount, percentage, isNew: false }
}

export function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  return match ? match[1].trim() : text.trim()
}

export async function resizeImageIfNeeded(file: File, maxBytes = 4_000_000): Promise<Blob> {
  if (file.size <= maxBytes) return file
  const img = await createImageBitmap(file)
  const scale = Math.sqrt(maxBytes / file.size)
  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(img.width * scale)
  canvas.height = Math.floor(img.height * scale)
  canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
  return new Promise((resolve) => canvas.toBlob(resolve as BlobCallback, 'image/jpeg', 0.85))
}

export function fileToBase64(blob: Blob): Promise<{ base64: string; mediaType: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const base64 = dataUrl.split(',')[1]
      const mediaType = blob.type || 'image/jpeg'
      resolve({ base64, mediaType })
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}
