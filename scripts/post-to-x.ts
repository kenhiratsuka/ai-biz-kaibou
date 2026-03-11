import { TwitterApi } from 'twitter-api-v2'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const client = new TwitterApi({
  appKey: process.env.X_API_KEY!,
  appSecret: process.env.X_API_SECRET!,
  accessToken: process.env.X_ACCESS_TOKEN!,
  accessSecret: process.env.X_ACCESS_SECRET!,
})

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')
const SITE_URL = process.env.SITE_URL ?? 'https://ai-biz-kaibou.vercel.app'
const POSTED_LOG = path.join(process.cwd(), '.posted-to-x.json')

function getPostedSlugs(): string[] {
  if (!fs.existsSync(POSTED_LOG)) return []
  return JSON.parse(fs.readFileSync(POSTED_LOG, 'utf-8'))
}

function markPosted(slug: string): void {
  const slugs = getPostedSlugs()
  slugs.push(slug)
  fs.writeFileSync(POSTED_LOG, JSON.stringify(slugs, null, 2))
}

function buildTweet(data: Record<string, unknown>, slug: string): string {
  const url = `${SITE_URL}/articles/${slug}`
  const revenue = data.monthly_revenue_range as string ?? ''
  const category = data.business_category as string ?? ''
  const automationLevel = data.automation_level as string ?? ''
  const summary = (data.summary as string ?? '').slice(0, 100)

  const lines = [
    `【設計図公開】${data.title}`,
    ``,
    revenue ? `💰 ${revenue}` : '',
    category ? `🏢 業種：${category}` : '',
    automationLevel ? `🤖 自動化難易度：${automationLevel}` : '',
    ``,
    summary + '…',
    ``,
    `詳細はこちら👇`,
    url,
    ``,
    `#AI副業 #自動化 #副業 #AIビジネス解剖室`,
  ].filter(Boolean)

  return lines.join('\n').slice(0, 280)
}

async function main() {
  if (!fs.existsSync(ARTICLES_DIR)) {
    console.log('No articles directory found.')
    return
  }

  const posted = getPostedSlugs()
  const files = fs.readdirSync(ARTICLES_DIR).filter(f => f.endsWith('.mdx') || f.endsWith('.md'))

  // Get the latest unposted article
  const unposted = files
    .map(f => {
      const slug = f.replace(/\.(mdx|md)$/, '')
      const raw = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf-8')
      const { data } = matter(raw)
      return { slug, data, published_at: data.published_at as string }
    })
    .filter(a => !posted.includes(a.slug))
    .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

  if (unposted.length === 0) {
    console.log('No new articles to post.')
    return
  }

  const article = unposted[0]
  const tweet = buildTweet(article.data, article.slug)

  console.log('Posting tweet:')
  console.log(tweet)

  try {
    const rwClient = client.readWrite
    await rwClient.v2.tweet(tweet)
    markPosted(article.slug)
    console.log(`Posted: ${article.slug}`)
  } catch (e) {
    console.error('Failed to post tweet:', e)
    process.exit(1)
  }
}

main().catch(console.error)
