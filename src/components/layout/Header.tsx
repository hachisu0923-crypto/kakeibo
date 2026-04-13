'use client'

import { formatMonthLabel, getPreviousMonth } from '@/lib/utils'

interface Props {
  selectedMonth: string
  onMonthChange: (month: string) => void
  availableMonths: string[]
}

export default function Header({ selectedMonth, onMonthChange, availableMonths }: Props) {
  function goToPrevMonth() {
    const prev = getPreviousMonth(selectedMonth)
    onMonthChange(prev)
  }

  function goToNextMonth() {
    const [year, month] = selectedMonth.split('-').map(Number)
    const d = new Date(year, month, 1)
    const next = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const today = new Date()
    const currentYM = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
    if (next <= currentYM) {
      onMonthChange(next)
    }
  }

  const today = new Date()
  const currentYM = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = selectedMonth === currentYM

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-lg font-bold text-indigo-700">💰</span>
          <span className="text-base font-bold text-gray-800">家計簿</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
            aria-label="前月"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(e.target.value)}
            className="text-sm font-semibold text-gray-700 bg-transparent border-none focus:outline-none cursor-pointer min-w-28 text-center"
          >
            {availableMonths.length === 0 ? (
              <option value={currentYM}>{formatMonthLabel(currentYM)}</option>
            ) : (
              availableMonths.map((ym) => (
                <option key={ym} value={ym}>
                  {formatMonthLabel(ym)}
                </option>
              ))
            )}
            {availableMonths.length > 0 && !availableMonths.includes(currentYM) && (
              <option value={currentYM}>{formatMonthLabel(currentYM)}</option>
            )}
          </select>

          <button
            onClick={goToNextMonth}
            disabled={isCurrentMonth}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="翌月"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div className="w-16" />
      </div>
    </header>
  )
}
