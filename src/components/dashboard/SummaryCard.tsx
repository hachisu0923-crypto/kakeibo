'use client'

import { formatCurrency, formatMonthLabel } from '@/lib/utils'

interface Props {
  monthKey: string
  totalSpend: number
  previousTotal: number
  transactionCount: number
}

export default function SummaryCard({ monthKey, totalSpend, previousTotal, transactionCount }: Props) {
  const delta = totalSpend - previousTotal
  const deltaPercent = previousTotal > 0 ? (delta / previousTotal) * 100 : null

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-2xl p-5 text-white shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-indigo-200 text-sm">{formatMonthLabel(monthKey)} の支出</p>
          <p className="text-3xl font-bold mt-1">{formatCurrency(totalSpend)}</p>
          <p className="text-indigo-200 text-xs mt-1">{transactionCount}件のレシート</p>
        </div>

        <div className="text-right">
          <p className="text-indigo-200 text-xs mb-1">先月比</p>
          {previousTotal === 0 && totalSpend === 0 ? (
            <p className="text-indigo-200 text-sm">データなし</p>
          ) : previousTotal === 0 ? (
            <p className="text-white text-sm font-medium">新規</p>
          ) : (
            <div className="flex flex-col items-end gap-0.5">
              <div className={`flex items-center gap-1 text-sm font-semibold ${delta > 0 ? 'text-red-200' : delta < 0 ? 'text-green-200' : 'text-white'}`}>
                {delta > 0 ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                ) : delta < 0 ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                  </svg>
                ) : null}
                {delta !== 0 && formatCurrency(Math.abs(delta))}
                {delta === 0 && '変化なし'}
              </div>
              {deltaPercent !== null && delta !== 0 && (
                <p className={`text-xs ${delta > 0 ? 'text-red-200' : 'text-green-200'}`}>
                  ({deltaPercent > 0 ? '+' : ''}{deltaPercent.toFixed(1)}%)
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
