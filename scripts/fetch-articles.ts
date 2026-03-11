import 'dotenv/config'
import Anthropic from '@anthropic-ai/sdk'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const ARTICLES_PER_RUN = 1
const REVIEW_PASS_THRESHOLD = 5
const MAX_RETRY = 2

interface ArticleMeta {
  title: string
  published_at: string
  tags: string[]
  business_category: string
  automation_level: '高' | '中' | '低'
  monthly_revenue_range: string
  initial_cost: string
  summary: string
  sources: string[]
  body: string
}

interface ReviewResult {
  score: number
  passed: boolean
  feedback: string
}

function getExistingCategories(): string[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []
  const files = fs.readdirSync(ARTICLES_DIR)
  const categories: string[] = []
  for (const file of files) {
    const content = fs.readFileSync(path.join(ARTICLES_DIR, file), 'utf-8')
    const match = content.match(/business_category:\s*"([^"]+)"/)
    if (match) categories.push(match[1])
  }
  return categories
}

async function generateTopics(existingCategories: string[]): Promise<string[]> {
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 500,
    messages: [{
      role: 'user',
      content: `あなたは「AIビジネス解剖室」というメディアのエディターです。テーマは「既存ビジネスをAIで自動化して個人が副収入を得る方法」です。

以下の業種はすでに記事化されています：
${existingCategories.length > 0 ? existingCategories.join('\n') : 'なし'}

まだ記事化されていない業種カテゴリを5つ提案してください。条件：
- 日本で実際に需要がある既存ビジネス
- AIを使えば業務の大部分を自動化できる可能性がある
- 個人レベルで参入できる（大きな初期投資不要）
- 海外でAI活用事例や関連ツールが存在する

JSON配列のみ返してください。例：["ローカルSEO代行", "SNS運用代行", "求人広告作成代行"]`,
    }],
  })
  const raw = (res.content[0] as { text: string }).text.trim()
  try {
    const cleaned = raw.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim()
    return JSON.parse(cleaned)
  } catch {
    console.error('Failed to parse topics:', raw)
    return []
  }
}

async function generateArticle(businessCategory: string): Promise<ArticleMeta> {
  const today = new Date().toISOString().split('T')[0]

  // Step A: メタデータ生成
  const metaRes = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 800,
    messages: [{
      role: 'user',
      content: `「AIビジネス解剖室」というメディア向けに、以下の業種の記事メタデータをJSONで返してください。

業種：${businessCategory}

以下のフィールドを含むJSONのみ返してください。マークダウン記法なし：
- title: 40文字以内の日本語タイトル（具体的な収益額を含める）
- tags: 2〜4個のタグ（例：["代行サービス", "自動化"]）
- automation_level: "高"、"中"、"低" のいずれか
- monthly_revenue_range: 想定月収レンジ（例："月30〜60万円"）
- initial_cost: 初期コストの目安（例："ほぼゼロ〜3万円"）
- summary: 200〜250文字の日本語要約
- sources: 参考になる海外ツール・サービスの実在するURL（2〜3件）`,
    }],
  })

  const metaRaw = (metaRes.content[0] as { text: string }).text.trim()
  const metaCleaned = metaRaw.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim()
  const meta = JSON.parse(metaCleaned)

  // Step B: 記事本文生成
  const bodyRes = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 6000,
    messages: [{
      role: 'user',
      content: `「AIビジネス解剖室」向けに、以下の業種について深掘り記事を日本語で書いてください。
読者は副業希望の会社員・フリーランスで、記事を読んで今日から行動できる状態にすることが目標です。

業種：${businessCategory}

【重要な執筆ルール】
- 収益の数字は必ずUpwork・Fiverr・クラウドワークス・ランサーズなどの実際の相場を根拠にすること（例：「Upworkでの相場は$50〜$150/件」）
- AIツールは必ず実在するもの（Claude API、GPT-4 API、n8n、Make.com、Zapierなど）を具体的に使い方まで書くこと
- 合計3500文字以上を必ず書くこと

以下の7セクション構成で記事本文のみ出力してください（JSONやfrontmatterは不要）：

## なぜ今なのか
この業種にAI自動化の商機がある理由。市場規模・担い手不足・AI技術の進歩など具体的な数字や背景を書く。

## AIで自動化できる部分の設計
具体的なAIツールを使ったワークフローを詳細に説明。ツールの設定方法や連携方法まで踏み込む。

## 実際のツール設定（ステップバイステップ）
n8n・Make.com・Claude APIなどの具体的な設定手順を番号付きで説明。スクリーンショットは不要だが手順は詳細に。

## 自動化できない部分（ここが重要）
人間が必ず担う必要がある部分。これが差別化ポイント。具体的に列挙する。

## 収益モデルの試算
料金設定（Upwork・Fiverr・国内プラットフォームの相場を根拠に）・想定クライアント数・月収試算（月額X万円 × Y社 ＝ 月収Z万円）・作業時間の見積もり。

## 参入のボトルネック
実際に始める際の障壁（技術・営業・法的など）。正直に書く。

## 最初の一歩
今日からできる具体的な3ステップ。ツール名・サービス名・登録URLまで具体的に記載する。`,
    }],
  })

  const body = (bodyRes.content[0] as { text: string }).text.trim()

  return {
    title: meta.title ?? businessCategory,
    published_at: today,
    tags: meta.tags ?? [],
    business_category: businessCategory,
    automation_level: meta.automation_level ?? '中',
    monthly_revenue_range: meta.monthly_revenue_range ?? '',
    initial_cost: meta.initial_cost ?? '',
    summary: meta.summary ?? '',
    sources: meta.sources ?? [],
    body,
  }
}

async function reviewArticle(meta: ArticleMeta): Promise<ReviewResult> {
  const res = await anthropic.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 150,
    messages: [{
      role: 'user',
      content: `記事を採点。JSONのみ返答。feedbackは20文字以内。

タイトル: ${meta.title}
本文: ${meta.body}

採点（各1か0）：
1. 市場背景が具体的か
2. AIツール名が明記されているか
3. 自動化できない部分があるか
4. 収益の数字があるか
5. 今日できる一歩があるか
6. 情報量が十分か

{"scores":[?,?,?,?,?,?],"feedback":"20文字以内"}`,
    }],
  })
  const raw = (res.content[0] as { text: string }).text.trim()
  try {
    const cleaned = raw.replace(/^```[a-z]*\n?/i, '').replace(/```$/i, '').trim()
    const data = JSON.parse(cleaned)
    const score = (data.scores as number[]).reduce((a: number, b: number) => a + b, 0)
    return { score, passed: score >= REVIEW_PASS_THRESHOLD, feedback: data.feedback ?? '' }
  } catch (e) {
    console.error('Review parse error:', e)
    console.error('Review raw:', raw)
    return { score: 0, passed: false, feedback: 'レビュー解析失敗' }
  }
}

function slugify(title: string): string {
  const hash = crypto.createHash('md5').update(title + Date.now()).digest('hex').slice(0, 6)
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 40)
    .replace(/-+$/, '') || 'article'
  return `${base}-${hash}`
}

function writeMdx(slug: string, meta: ArticleMeta): void {
  const sourcesYaml = meta.sources.length > 0
    ? `sources:\n${meta.sources.map(s => `  - "${s}"`).join('\n')}`
    : 'sources: []'

  const frontmatter = [
    '---',
    `title: "${meta.title.replace(/"/g, '\\"')}"`,
    `published_at: "${meta.published_at}"`,
    `tags: [${meta.tags.map(t => `"${t}"`).join(', ')}]`,
    `business_category: "${meta.business_category}"`,
    `automation_level: "${meta.automation_level}"`,
    `monthly_revenue_range: "${meta.monthly_revenue_range}"`,
    `initial_cost: "${meta.initial_cost}"`,
    `summary: "${meta.summary.replace(/"/g, '\\"')}"`,
    sourcesYaml,
    '---',
  ].join('\n')

  const content = `${frontmatter}\n\n${meta.body}\n`
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  fs.writeFileSync(filePath, content, 'utf-8')
  console.log(`Written: ${filePath}`)
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  }

  const existingCategories = getExistingCategories()
  console.log(`Existing categories: ${existingCategories.length}`)

  console.log('Generating topic candidates...')
  const topics = await generateTopics(existingCategories)
  console.log(`Topics: ${topics.join(', ')}`)

  let processed = 0

  for (const topic of topics) {
    if (processed >= ARTICLES_PER_RUN) break
    if (existingCategories.includes(topic)) {
      console.log(`Skip (exists): ${topic}`)
      continue
    }

    let meta: ArticleMeta | null = null
    let attempt = 0

    while (attempt < MAX_RETRY) {
      attempt++
      console.log(`[${attempt}/${MAX_RETRY}] Generating: ${topic}`)
      try {
        meta = await generateArticle(topic)
      } catch (e) {
        console.error(`Generation failed: ${e}`)
        break
      }
      await new Promise(r => setTimeout(r, 1000))

      const review = await reviewArticle(meta)
      console.log(`  Score: ${review.score}/6 — ${review.feedback}`)

      if (review.passed) {
        console.log(`  Passed`)
        break
      } else {
        console.log(`  Failed, ${attempt < MAX_RETRY ? 'retrying...' : 'skipping'}`)
        if (attempt >= MAX_RETRY) meta = null
        await new Promise(r => setTimeout(r, 1000))
      }
    }

    if (!meta) continue

    const slug = slugify(meta.title || topic)
    writeMdx(slug, meta)
    processed++
    await new Promise(r => setTimeout(r, 2000))
  }

  console.log(`Done. Generated ${processed} articles.`)
}

main().catch(console.error)
