import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '記事一覧',
}

export const revalidate = 3600

export default function ArticlesPage() {
  const articles = getAllArticles()

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        記事一覧 <span className="text-sm font-normal text-gray-400 ml-2">{articles.length}件</span>
      </h1>
      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">記事がまだありません。</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
