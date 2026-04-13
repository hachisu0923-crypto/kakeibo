'use client'

import { TransactionItem, Category } from '@/types'
import { CATEGORIES, CATEGORY_META } from '@/lib/categories'
import { formatCurrency } from '@/lib/utils'

interface Props {
  item: TransactionItem
  index: number
  onChange: (index: number, updated: TransactionItem) => void
  onDelete: (index: number) => void
}

export default function ItemRow({ item, index, onChange, onDelete }: Props) {
  function update(field: keyof TransactionItem, value: string | number) {
    onChange(index, { ...item, [field]: value })
  }

  const subtotal = item.price * item.quantity

  return (
    <div className="flex flex-col gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={item.name}
          onChange={(e) => update('name', e.target.value)}
          placeholder="商品名"
          className="flex-1 px-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          type="button"
          onClick={() => onDelete(index)}
          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
          aria-label="削除"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">¥</span>
          <input
            type="number"
            value={item.price}
            onChange={(e) => update('price', parseInt(e.target.value) || 0)}
            min={0}
            className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">×</span>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => update('quantity', parseInt(e.target.value) || 1)}
            min={1}
            className="w-16 px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>

        <select
          value={item.category}
          onChange={(e) => update('category', e.target.value as Category)}
          className="flex-1 min-w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {CATEGORY_META[cat].icon} {CATEGORY_META[cat].label}
            </option>
          ))}
        </select>

        <span className="text-sm font-medium text-gray-700 ml-auto">
          {formatCurrency(subtotal)}
        </span>
      </div>
    </div>
  )
}
