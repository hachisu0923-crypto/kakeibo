'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { CategorySummary } from '@/types'
import { CATEGORY_META } from '@/lib/categories'
import { formatCurrency, formatMonthLabel, getPreviousMonth } from '@/lib/utils'

interface Props {
  categories: CategorySummary[]
  previousCategories: CategorySummary[]
  currentMonthKey: string
}

export default function CategoryBarChart({
  categories,
  previousCategories,
  currentMonthKey,
}: Props) {
  const prevMonthKey = getPreviousMonth(currentMonthKey)

  const activeCategories = categories.filter(
    (c) =>
      c.total > 0 ||
      previousCategories.some((p) => p.category === c.category && p.total > 0)
  )

  if (activeCategories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">先月との比較</h2>
        <div className="flex items-center justify-center h-40 text-gray-300 text-sm">
          データなし
        </div>
      </div>
    )
  }

  const data = activeCategories.map((cat) => {
    const prev = previousCategories.find((p) => p.category === cat.category)
    const meta = CATEGORY_META[cat.category]
    return {
      name: meta.icon,
      label: meta.label,
      current: cat.total,
      previous: prev?.total ?? 0,
      color: meta.color,
    }
  })

  const formatYAxis = (value: number) => {
    if (value >= 10000) return `${(value / 10000).toFixed(0)}万`
    if (value >= 1000) return `${(value / 1000).toFixed(0)}千`
    return `${value}`
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <h2 className="text-sm font-semibold text-gray-700 mb-1">先月との比較</h2>
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-indigo-500" />
          <span className="text-xs text-gray-500">{formatMonthLabel(currentMonthKey)}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-gray-200" />
          <span className="text-xs text-gray-500">{formatMonthLabel(prevMonthKey)}</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 5, left: -10, bottom: 5 }} barSize={10}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 16 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatYAxis}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            formatter={(value: number, name: string) => [
              formatCurrency(value),
              name === 'current' ? formatMonthLabel(currentMonthKey) : formatMonthLabel(prevMonthKey),
            ]}
            labelFormatter={(label, payload) => {
              if (payload && payload.length > 0) {
                return (payload[0].payload as { label: string }).label
              }
              return label
            }}
            contentStyle={{ fontSize: 12, borderRadius: 8 }}
          />
          <Bar dataKey="previous" radius={[3, 3, 0, 0]} fill="#e5e7eb" />
          <Bar dataKey="current" radius={[3, 3, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
