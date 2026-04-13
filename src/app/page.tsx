'use client'

import { useState, useEffect, useCallback } from 'react'
import { Transaction } from '@/types'
import { getTransactionsByMonth, getAllMonths } from '@/lib/storage'
import { getCurrentMonthKey, getPreviousMonth, computeMonthSummary } from '@/lib/utils'
import Header from '@/components/layout/Header'
import SummaryCard from '@/components/dashboard/SummaryCard'
import CategoryPieChart from '@/components/dashboard/CategoryPieChart'
import CategoryBarChart from '@/components/dashboard/CategoryBarChart'
import CategoryList from '@/components/dashboard/CategoryList'
import TransactionList from '@/components/dashboard/TransactionList'

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [previousTransactions, setPreviousTransactions] = useState<Transaction[]>([])
  const [availableMonths, setAvailableMonths] = useState<string[]>([])

  function loadData(month: string) {
    const allMonths = getAllMonths()
    const currentMonthKey = getCurrentMonthKey()

    // Ensure current month is always available in the list
    const monthsWithCurrent = allMonths.includes(currentMonthKey)
      ? allMonths
      : [currentMonthKey, ...allMonths]

    setAvailableMonths(monthsWithCurrent)
    setTransactions(getTransactionsByMonth(month))
    setPreviousTransactions(getTransactionsByMonth(getPreviousMonth(month)))
  }

  useEffect(() => {
    loadData(selectedMonth)
  }, [selectedMonth])

  function handleMonthChange(month: string) {
    setSelectedMonth(month)
  }

  function handleTransactionDelete(id: string) {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id))
  }

  const summary = computeMonthSummary(transactions, selectedMonth)
  const previousSummary = computeMonthSummary(previousTransactions, getPreviousMonth(selectedMonth))

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <Header
        selectedMonth={selectedMonth}
        onMonthChange={handleMonthChange}
        availableMonths={availableMonths}
      />

      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <SummaryCard
          monthKey={selectedMonth}
          totalSpend={summary.totalSpend}
          previousTotal={previousSummary.totalSpend}
          transactionCount={summary.transactionCount}
        />

        <CategoryPieChart
          categories={summary.categories}
          totalSpend={summary.totalSpend}
        />

        <CategoryBarChart
          categories={summary.categories}
          previousCategories={previousSummary.categories}
          currentMonthKey={selectedMonth}
        />

        <CategoryList
          categories={summary.categories}
          previousCategories={previousSummary.categories}
        />

        <TransactionList
          transactions={transactions}
          onDelete={handleTransactionDelete}
        />
      </div>
    </div>
  )
}
