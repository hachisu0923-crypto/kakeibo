export type Category =
  | '食費'
  | '日用品'
  | '交通費'
  | '医療費'
  | '娯楽'
  | '衣類'
  | '光熱費'
  | 'その他'

export interface TransactionItem {
  name: string
  price: number
  quantity: number
  category: Category
}

export interface Transaction {
  id: string
  date: string       // "YYYY-MM-DD"
  storeName: string
  items: TransactionItem[]
  total: number
  createdAt: string  // ISO timestamp
}

export interface ReceiptAnalysis {
  storeName: string
  date: string       // "YYYY-MM-DD"
  items: TransactionItem[]
  total: number
}

export interface CategorySummary {
  category: Category
  total: number
  count: number
  percentage: number
}

export interface MonthSummary {
  monthKey: string   // "YYYY-MM"
  totalSpend: number
  categories: CategorySummary[]
  transactionCount: number
}
