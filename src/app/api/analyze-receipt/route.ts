import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { ReceiptAnalysis } from '@/types'
import { extractJson, getTodayString } from '@/lib/utils'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `あなたはレシート解析の専門家です。
画像からレシートの情報を読み取り、必ず以下のJSON形式のみで回答してください。
説明文やマークダウンは一切不要です。JSONのみ出力してください。

カテゴリは必ず以下のいずれかを使用してください：
食費, 日用品, 交通費, 医療費, 娯楽, 衣類, 光熱費, その他

カテゴリの判断基準：
- 食費: 食品、飲料、外食、コンビニの食べ物、お菓子
- 日用品: 洗剤、シャンプー、ティッシュ、掃除用品、文具、雑貨
- 交通費: 電車、バス、タクシー、ガソリン、駐車場
- 医療費: 薬、病院、ドラッグストアの医薬品、サプリメント
- 娯楽: 書籍、ゲーム、映画、音楽、スポーツ用品、玩具
- 衣類: 服、靴、バッグ、アクセサリー、下着
- 光熱費: 電気、ガス、水道、スマホ、インターネット料金
- その他: 上記に当てはまらないもの`

function buildUserPrompt(todayDate: string): string {
  return `このレシートを解析してください。以下のJSON形式で回答してください：

{
  "storeName": "店舗名（読み取れない場合は空文字）",
  "date": "YYYY-MM-DD形式（読み取れない場合は今日の日付 ${todayDate}）",
  "items": [
    {
      "name": "商品名",
      "price": 価格（数値、税込）,
      "quantity": 数量（数値、不明な場合は1）,
      "category": "カテゴリ名"
    }
  ],
  "total": 合計金額（数値、税込）
}`
}

function validateAnalysis(data: unknown): data is ReceiptAnalysis {
  if (!data || typeof data !== 'object') return false
  const obj = data as Record<string, unknown>
  if (typeof obj.storeName !== 'string') return false
  if (typeof obj.date !== 'string') return false
  if (!Array.isArray(obj.items)) return false
  if (typeof obj.total !== 'number') return false
  for (const item of obj.items) {
    if (!item || typeof item !== 'object') return false
    const it = item as Record<string, unknown>
    if (typeof it.name !== 'string') return false
    if (typeof it.price !== 'number') return false
    if (typeof it.quantity !== 'number') return false
    if (typeof it.category !== 'string') return false
  }
  return true
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { imageBase64, mediaType } = body as { imageBase64: string; mediaType: string }

    if (!imageBase64 || !mediaType) {
      return NextResponse.json({ error: '画像データが不正です' }, { status: 400 })
    }

    const validMediaTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    if (!validMediaTypes.includes(mediaType)) {
      return NextResponse.json({ error: 'サポートされていない画像形式です' }, { status: 400 })
    }

    const todayDate = getTodayString()

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2048,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
                data: imageBase64,
              },
            },
            {
              type: 'text',
              text: buildUserPrompt(todayDate),
            },
          ],
        },
      ],
    })

    const textContent = message.content.find((c) => c.type === 'text')
    if (!textContent || textContent.type !== 'text') {
      return NextResponse.json({ error: 'レシートの解析に失敗しました' }, { status: 502 })
    }

    const jsonText = extractJson(textContent.text)

    let parsed: unknown
    try {
      parsed = JSON.parse(jsonText)
    } catch {
      return NextResponse.json(
        { error: 'レシートの情報を読み取れませんでした。別の画像をお試しください。' },
        { status: 502 }
      )
    }

    if (!validateAnalysis(parsed)) {
      return NextResponse.json(
        { error: 'レシートの情報を正しく解析できませんでした' },
        { status: 502 }
      )
    }

    // Ensure date is valid, fallback to today
    if (!parsed.date || !/^\d{4}-\d{2}-\d{2}$/.test(parsed.date)) {
      parsed.date = todayDate
    }

    return NextResponse.json({ analysis: parsed })
  } catch (error) {
    console.error('Receipt analysis error:', error)
    if (error instanceof Error && error.message.includes('rate_limit')) {
      return NextResponse.json(
        { error: 'リクエストが多すぎます。しばらく待ってからお試しください。' },
        { status: 429 }
      )
    }
    return NextResponse.json({ error: 'レシートの解析中にエラーが発生しました' }, { status: 500 })
  }
}
