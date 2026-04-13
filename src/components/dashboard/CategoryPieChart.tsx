'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { CategorySummary } from '@/types'
import { CATEGORY_META } from '@/lib/categories'
import { formatCurrency } from '@/lib/utils'

interface Props {
  categories: CategorySummary[]
  totalSpend: number
}

export default function CategoryPieChart({ categories, totalSpend }: Props) {
  const activeCategories = categories.filter((c) => c.total > 0)

  if (activeCategories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">支出の内訳</h2>
        <div className="flex items-center justify-center h-40 text-gray-300 text-sm">
          データなし
        </div>
      </div>
    )
  }

  const data = activeCategories.map((cat) => ({
    name: CATEGORY_META[cat.category].label,
    value: cat.total,
    color: CATEGORY_META[cat.category].color,
    icon: CATEGORY_META[cat.category].icon,
  }))

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-700 mb-3">支出の内訳</h2>
      <div className="relative">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(label) => label}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-xs text-gray-400">合計</p>
            <p className="text-base font-bold text-gray-800">{formatCurrency(totalSpend)}</p>
          </div>
        </div>
      </div>

      {/* Custom legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: entry.color }} />
            <span className="text-xs text-gray-600 truncate">{entry.icon} {entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
