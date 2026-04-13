'use client'

import { CategorySummary } from '@/types'
import { CATEGORY_META } from '@/lib/categories'
import { formatCurrency, computeCategoryDelta } from '@/lib/utils'

interface Props {
  categories: CategorySummary[]
  previousCategories: CategorySummary[]
}

export default function CategoryList({ categories, previousCategories }: Props) {
  const activeCategories = categories.filter((c) => c.total > 0)

  if (activeCategories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 text-center">
        <p className="text-gray-400 text-sm">今月の支出データがありません</p>
        <p className="text-gray-300 text-xs mt-1">レシートを追加してください</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      <div className="px-4 py-3 border-b border-gray-50">
        <h2 className="text-sm font-semibold text-gray-700">カテゴリ別支出</h2>
      </div>
      <div className="divide-y divide-gray-50">
        {activeCategories.map((cat) => {
          const meta = CATEGORY_META[cat.category]
          const prevCat = previousCategories.find((p) => p.category === cat.category)
          const delta = computeCategoryDelta(cat.total, prevCat?.total ?? 0)

          return (
            <div key={cat.category} className="px-4 py-3">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base">{meta.icon}</span>
                  <span className="text-sm font-medium text-gray-700">{meta.label}</span>
                  {delta.isNew && (
                    <span className="text-xs text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">新規</span>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-gray-800">{formatCurrency(cat.total)}</span>
                  {!delta.isNew && delta.amount !== 0 && (
                    <span className={`text-xs ml-1.5 ${delta.amount > 0 ? 'text-red-500' : 'text-green-600'}`}>
                      {delta.amount > 0 ? '▲' : '▼'}{formatCurrency(Math.abs(delta.amount))}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${cat.percentage}%`,
                      backgroundColor: meta.color,
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10 text-right">
                  {cat.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
