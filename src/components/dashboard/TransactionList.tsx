'use client'

import { useState } from 'react'
import { Transaction } from '@/types'
import { CATEGORY_META } from '@/lib/categories'
import { formatCurrency, formatDate } from '@/lib/utils'
import { deleteTransaction } from '@/lib/storage'

interface Props {
  transactions: Transaction[]
  onDelete: (id: string, date: string) => void
}

export default function TransactionList({ transactions, onDelete }: Props) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function handleDelete(tx: Transaction) {
    if (confirm(`「${tx.storeName}」のレシートを削除しますか？`)) {
      deleteTransaction(tx.id, tx.date)
      onDelete(tx.id, tx.date)
    }
  }

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
        <p className="text-gray-400 text-sm">レシートがありません</p>
        <p className="text-gray-300 text-xs mt-1">「レシート追加」からレシートを登録できます</p>
      </div>
    )
  }

  const sorted = [...transactions].sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="px-4 py-3 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">
          レシート一覧 ({transactions.length}件)
        </h2>
      </div>

      <div className="divide-y divide-gray-50">
        {sorted.map((tx) => {
          const isExpanded = expanded.has(tx.id)
          return (
            <div key={tx.id}>
              <button
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                onClick={() => toggleExpand(tx.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-800 truncate">
                      {tx.storeName || '不明な店舗'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">{formatDate(tx.date)}</span>
                    <span className="text-xs text-gray-300">·</span>
                    <span className="text-xs text-gray-400">{tx.items.length}品</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <span className="text-sm font-semibold text-gray-800">
                    {formatCurrency(tx.total)}
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3 bg-gray-50">
                  <div className="space-y-1.5 mb-3">
                    {tx.items.map((item, i) => {
                      const meta = CATEGORY_META[item.category]
                      return (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <span className={`text-xs px-1.5 py-0.5 rounded-full flex-shrink-0 ${meta.bgClass} ${meta.textClass}`}>
                              {meta.icon}
                            </span>
                            <span className="text-gray-700 truncate">{item.name}</span>
                            {item.quantity > 1 && (
                              <span className="text-gray-400 text-xs flex-shrink-0">×{item.quantity}</span>
                            )}
                          </div>
                          <span className="text-gray-600 ml-2 flex-shrink-0">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <button
                      onClick={() => handleDelete(tx)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      削除
                    </button>
                    <span className="text-xs font-semibold text-gray-600">
                      合計 {formatCurrency(tx.total)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
