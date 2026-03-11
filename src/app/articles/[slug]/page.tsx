import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/articles'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import TagBadge from '@/components/TagBadge'
import BusinessModelDiagram from '@/components/BusinessModelDiagram'
import ArticleCard from '@/components/ArticleCard'
import ShareButtons from '@/components/ShareButtons'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

export async function generateStaticParams() {
  const articles = getAllArticles()
  return articles.map(a => ({ slug: a.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) return {}
  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.published_at,
      images: [{ url: '/og-default.svg', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
    },
  }
}

const AUTOMATION_LEVEL_COLORS: Record<string, string> = {
  '高': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  '中': 'bg-amber-50 text-amber-700 border-amber-200',
  '低': 'bg-red-50 text-red-600 border-red-200',
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = getArticleBySlug(slug)
  if (!article) notFound()

  const related = getRelatedArticles(slug, article.tags ?? [])
  const levelColor = AUTOMATION_LEVEL_COLORS[article.automation_level] ?? 'bg-gray-50 text-gray-500 border-gray-200'

  return (
    <article className="max-w-2xl mx-auto">
      {/* Back */}
      <Link href="/" className="text-sm text-blue-600 hover:text-blue-700 transition-colors mb-6 inline-block">
        ← トップに戻る
      </Link>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {article.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
      </div>

      {/* Title */}
      <h1 className="text-2xl font-bold text-gray-900 leading-snug mb-2">
        {article.title}
      </h1>

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-6 pb-4 border-b border-gray-200">
        <span>{new Date(article.published_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        {article.automation_level && (
          <span className={`text-xs font-bold border px-2 py-0.5 rounded-lg ${levelColor}`}>
            自動化難易度：{article.automation_level}
          </span>
        )}
        {article.monthly_revenue_range && (
          <span className="text-emerald-600 font-bold">{article.monthly_revenue_range}</span>
        )}
        {article.initial_cost && (
          <span className="text-gray-500">初期費用：{article.initial_cost}</span>
        )}
      </div>

      {/* Share Buttons */}
      <ShareButtons title={article.title} slug={article.slug} />

      {/* Business Model Diagram */}
      <BusinessModelDiagram
        businessCategory={article.business_category}
        automationLevel={article.automation_level}
        monthlyRevenueRange={article.monthly_revenue_range}
        initialCost={article.initial_cost}
      />

      {/* Summary */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 mb-8">
        <p className="text-xs font-medium text-blue-500 mb-2">この記事のポイント</p>
        <p className="text-gray-700 leading-relaxed">{article.summary}</p>
      </div>

      {/* MDX Content */}
      <div className="prose prose-gray max-w-none mb-8">
        <MDXRemote source={article.content} options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }} />
      </div>

      {/* Sources */}
      {article.sources && article.sources.length > 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 mb-8">
          <p className="text-xs font-medium text-gray-500 mb-3">参考情報</p>
          <ul className="space-y-1">
            {article.sources.map((url, i) => (
              <li key={i}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-600 hover:text-blue-700 break-all"
                >
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* X CTA */}
      <div className="bg-gray-900 text-white rounded-2xl p-6 mb-8 text-center">
        <p className="font-bold mb-1">この設計図を試しましたか？</p>
        <p className="text-gray-400 text-sm mb-4">
          結果・感想・改善点をXで教えてください。記事改善に活かします。
        </p>
        <a
          href="https://twitter.com/intent/tweet?text=AIビジネス解剖室の設計図を試してみました！&url=https://ai-biz-kaibou.vercel.app&via=ai_biz_kaibou"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-gray-900 font-bold px-6 py-2.5 rounded-full text-sm hover:bg-gray-100 transition-colors"
        >
          X でシェアする
        </a>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <a
            href="https://twitter.com/ai_biz_kaibou"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            @ai_biz_kaibou をフォローして毎日の設計図を受け取る →
          </a>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-bold text-gray-900 mb-4">関連する設計図</h2>
          <div className="grid grid-cols-1 gap-4">
            {related.map(a => (
              <ArticleCard key={a.slug} article={a} />
            ))}
          </div>
        </div>
      )}
    </article>
  )
}
