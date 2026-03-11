import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>
}): Promise<Metadata> {
  const { tag } = await params
  return { title: `#${decodeURIComponent(tag)} の記事` }
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>
}) {
  const { tag } = await params
  const decoded = decodeURIComponent(tag)
  const articles = getAllArticles().filter(a => a.tags?.includes(decoded))

  if (articles.length === 0) notFound()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        #{decoded}
        <span className="text-sm font-normal text-gray-400 ml-2">{articles.length}件</span>
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map(article => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}
