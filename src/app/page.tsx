import { getAllArticles } from '@/lib/articles'
import ArticleCard from '@/components/ArticleCard'
import Link from 'next/link'

export const revalidate = 3600

export default function HomePage() {
  const articles = getAllArticles()
  const latest = articles.slice(0, 9)

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-20 mb-12">
        <div className="inline-block border border-gray-200 text-gray-500 text-xs px-3 py-1 rounded-full mb-6 bg-gray-50">
          既存ビジネス × AI自動化 — 設計図メディア
        </div>
        <h1 className="text-5xl font-bold text-gradient mb-5">
          AIビジネス解剖室
        </h1>
        <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed">
          「この業種、AIで自動化したらいくら稼げる？」を深掘り解説。
          <br />
          副業・フリーランスとして今日から動けるレベルの設計図をお届けします。
        </p>
        <div className="mt-6 flex justify-center gap-2 text-xs">
          <span className="border border-gray-200 text-gray-500 px-3 py-1 rounded-full bg-gray-50">毎日更新</span>
          <span className="border border-gray-200 text-gray-500 px-3 py-1 rounded-full bg-gray-50">収益試算あり</span>
          <span className="border border-gray-200 text-gray-500 px-3 py-1 rounded-full bg-gray-50">全記事無料</span>
        </div>
      </div>

      {/* Latest Articles */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">最新の設計図</h2>
        <Link href="/articles" className="text-sm text-blue-600 hover:text-blue-700 transition-colors">
          すべて見る →
        </Link>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>記事を準備中です。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map(article => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
