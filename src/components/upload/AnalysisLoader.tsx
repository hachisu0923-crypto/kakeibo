'use client'

interface Props {
  previewUrl: string
}

export default function AnalysisLoader({ previewUrl }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="flex items-center gap-4 w-full max-w-md">
        <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="レシート" className="w-full h-full object-cover" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm font-medium text-indigo-700">レシートを解析中...</span>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-4/5" />
            <div className="h-3 bg-gray-200 rounded animate-pulse w-3/5" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-md space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 bg-gray-200 rounded animate-pulse flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-gray-200 rounded animate-pulse" />
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
            </div>
            <div className="w-16 h-3 bg-gray-200 rounded animate-pulse" />
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400">
        Claude AI がレシートの内容を読み取っています
      </p>
    </div>
  )
}
