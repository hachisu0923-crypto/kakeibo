'use client'

import { useRef, useState, DragEvent, ChangeEvent } from 'react'
import { resizeImageIfNeeded, fileToBase64 } from '@/lib/utils'

interface Props {
  onImageSelected: (base64: string, mediaType: string, previewUrl: string) => void
  onError: (msg: string) => void
}

export default function ImageDropzone({ onImageSelected, onError }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  async function processFile(file: File) {
    if (!file.type.startsWith('image/')) {
      onError('画像ファイルを選択してください')
      return
    }
    if (file.size > 20 * 1024 * 1024) {
      onError('ファイルサイズが大きすぎます（最大20MB）')
      return
    }

    const previewUrl = URL.createObjectURL(file)
    const resized = await resizeImageIfNeeded(file)
    const { base64, mediaType } = await fileToBase64(resized)
    onImageSelected(base64, mediaType, previewUrl)
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault()
    setDragging(true)
  }

  function handleDragLeave() {
    setDragging(false)
  }

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={() => inputRef.current?.click()}
      className={`
        flex flex-col items-center justify-center gap-4
        border-2 border-dashed rounded-2xl p-10 cursor-pointer
        transition-all duration-200 min-h-64
        ${dragging
          ? 'border-indigo-500 bg-indigo-50'
          : 'border-gray-300 bg-gray-50 hover:border-indigo-400 hover:bg-indigo-50'
        }
      `}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleChange}
      />

      <div className="text-5xl">📷</div>

      <div className="text-center">
        <p className="text-lg font-medium text-gray-700">
          レシートの写真を選択
        </p>
        <p className="text-sm text-gray-500 mt-1">
          タップして撮影、またはファイルを選択
        </p>
        <p className="text-xs text-gray-400 mt-1">
          JPG・PNG・WEBP対応（最大20MB）
        </p>
      </div>

      <button
        type="button"
        className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
        onClick={(e) => { e.stopPropagation(); inputRef.current?.click() }}
      >
        ファイルを選択
      </button>
    </div>
  )
}
