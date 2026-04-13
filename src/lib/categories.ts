import { Category } from '@/types'

export const CATEGORIES: Category[] = [
  '食費',
  '日用品',
  '交通費',
  '医療費',
  '娯楽',
  '衣類',
  '光熱費',
  'その他',
]

export const CATEGORY_META: Record<
  Category,
  {
    label: string
    color: string
    bgClass: string
    textClass: string
    icon: string
  }
> = {
  食費:   { label: '食費・外食',       color: '#f97316', bgClass: 'bg-orange-100', textClass: 'text-orange-700', icon: '🍚' },
  日用品: { label: '日用品',           color: '#8b5cf6', bgClass: 'bg-violet-100', textClass: 'text-violet-700', icon: '🧴' },
  交通費: { label: '交通費',           color: '#3b82f6', bgClass: 'bg-blue-100',   textClass: 'text-blue-700',   icon: '🚃' },
  医療費: { label: '医療費',           color: '#ef4444', bgClass: 'bg-red-100',    textClass: 'text-red-700',    icon: '💊' },
  娯楽:   { label: '娯楽・趣味',       color: '#ec4899', bgClass: 'bg-pink-100',   textClass: 'text-pink-700',   icon: '🎮' },
  衣類:   { label: '衣類・ファッション', color: '#14b8a6', bgClass: 'bg-teal-100',  textClass: 'text-teal-700',   icon: '👕' },
  光熱費: { label: '光熱費・通信費',   color: '#eab308', bgClass: 'bg-yellow-100', textClass: 'text-yellow-700', icon: '💡' },
  その他: { label: 'その他',           color: '#6b7280', bgClass: 'bg-gray-100',   textClass: 'text-gray-600',   icon: '📦' },
}
