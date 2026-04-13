'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ReceiptAnalysis } from '@/types'
import ImageDropzone from '@/components/upload/ImageDropzone'
import AnalysisLoader from '@/components/upload/AnalysisLoader'
import ReviewForm from '@/components/upload/ReviewForm'

type Stage = 'idle' | 'analyzing' | 'review' | 'saved'

interface PageState {
  stage: Stage
  previewUrl: string | null
  analysis: ReceiptAnalysis | null
  error: string | null
}

export default function UploadPage() {
  const router = useRouter()
  const [state, setState] = useState<PageState>({
    stage: 'idle',
    previewUrl: null,
    analysis: null,
    error: null,
  })

  async function handleImageSelected(base64: string, mediaType: string, previewUrl: string) {
    setState({ stage: 'analyzing', previewUrl, analysis: null, error: null })

    try {
      const res = await fetch('/api/analyze-receipt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mediaType }),
      })

      const data = await res.json()

      if (!res.ok || data.error) {
        setState((prev) => ({
          ...prev,
          stage: 'idle',
          error: data.error || 'レシートの解析に失敗しました',
        }))
        return
      }

      setState({ stage: 'review', previewUrl, analysis: data.analysis, error: null })
    } catch {
      setState((prev) => ({
        ...prev,
        stage: 'idle',
        error: 'ネットワークエラーが発生しました。もう一度お試しください。',
      }))
    }
  }

  function handleSaved() {
    setState((prev) => ({ ...prev, stage: 'saved' }))
  }

  function handleCancel() {
    setState({ stage: 'idle', previewUrl: null, analysis: null, error: null })
  }

  function handleUploadAnother() {
    setState({ stage: 'idle', previewUrl: null, analysis: null, error: null })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-xl font-bold text-gray-800 mb-6">レシートを追加</h1>

        {state.error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{state.error}</p>
          </div>
        )}

        {state.stage === 'idle' && (
          <ImageDropzone
            onImageSelected={handleImageSelected}
            onError={(msg) => setState((prev) => ({ ...prev, error: msg }))}
          />
        )}

        {state.stage === 'analyzing' && state.previewUrl && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <AnalysisLoader previewUrl={state.previewUrl} />
          </div>
        )}

        {state.stage === 'review' && state.analysis && state.previewUrl && (
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <ReviewForm
              analysis={state.analysis}
              previewUrl={state.previewUrl}
              onSaved={handleSaved}
              onCancel={handleCancel}
            />
          </div>
        )}

        {state.stage === 'saved' && (
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">保存しました！</h2>
            <p className="text-sm text-gray-500 mb-6">レシートの内容を家計簿に記録しました</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push('/')}
                className="w-full py-3 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors"
              >
                ダッシュボードで確認
              </button>
              <button
                onClick={handleUploadAnother}
                className="w-full py-3 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-xl hover:bg-indigo-50 transition-colors"
              >
                もう1枚追加する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
