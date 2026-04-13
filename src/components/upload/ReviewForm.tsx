'use client'

import { useState } from 'react'
import { ReceiptAnalysis, Transaction, TransactionItem, Category } from '@/types'
import { CATEGORY_META } from '@/lib/categories'
import { formatCurrency, getTodayString } from '@/lib/utils'
import { saveTransaction } from '@/lib/storage'
import ItemRow from './ItemRow'

interface Props {
  analysis: ReceiptAnalysis
  previewUrl: string
  onSaved: () => void
  onCancel: () => void
}

export default function ReviewForm({ analysis, previewUrl, onSaved, onCancel }: Props) {
  const [storeName, setStoreName] = useState(analysis.storeName)
  const [date, setDate] = useState(analysis.date || getTodayString())
  const [items, setItems] = useState<TransactionItem[]>(analysis.items)

  const calculatedTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  function updateItem(index: number, updated: TransactionItem) {
    setItems((prev) => prev.map((item, i) => (i === index ? updated : item)))
  }

  function deleteItem(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  function addItem() {
    setItems((prev) => [
      ...prev,
      { name: '', price: 0, quantity: 1, category: 'その他' as Category },
    ])
  }

  function handleSave() {
    const tx: Transaction = {
      id: crypto.randomUUID(),
      date,
      storeName: storeName || '不明な店舗',
      items,
      total: calculatedTotal,
      createdAt: new Date().toISOString(),
    }
    saveTransaction(tx)
    onSaved()
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Receipt preview + store info */}
      <div className="flex items-start gap-4">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="レシート" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">店舗名</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              placeholder="店舗名を入力"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 mb-1 block">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
          </div>
        </div>
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">
            商品リスト ({items.length}件)
          </h3>
        </div>

        {items.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">商品がありません</p>
        ) : (
          <div className="space-y-2">
            {items.map((item, i) => (
              <ItemRow
                key={i}
                item={item}
                index={i}
                onChange={updateItem}
                onDelete={deleteItem}
              />
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={addItem}
          className="mt-2 w-full py-2 text-sm text-indigo-600 border border-dashed border-indigo-300 rounded-lg hover:bg-indigo-50 transition-colors"
        >
          + 商品を追加
        </button>
      </div>

      {/* Category summary */}
      {items.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs font-medium text-gray-500 mb-2">カテゴリ別</p>
          {Object.entries(
            items.reduce((acc, item) => {
              const cat = item.category
              acc[cat] = (acc[cat] || 0) + item.price * item.quantity
              return acc
            }, {} as Record<string, number>)
          ).map(([cat, total]) => {
            const meta = CATEGORY_META[cat as Category]
            return (
              <div key={cat} className="flex items-center justify-between text-sm py-0.5">
                <span className={`${meta.textClass} font-medium`}>
                  {meta.icon} {meta.label}
                </span>
                <span className="text-gray-700">{formatCurrency(total)}</span>
              </div>
            )
          })}
        </div>
      )}

      {/* Total */}
      <div className="flex items-center justify-between py-3 border-t border-gray-200">
        <span className="font-semibold text-gray-700">合計</span>
        <span className="text-xl font-bold text-indigo-700">{formatCurrency(calculatedTotal)}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={items.length === 0}
          className="flex-1 py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          保存する →
        </button>
      </div>
    </div>
  )
}
