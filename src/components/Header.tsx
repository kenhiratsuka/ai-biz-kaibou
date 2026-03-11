import Link from 'next/link'
import { getAllTags } from '@/lib/articles'

export default function Header() {
  const tags = getAllTags()

  return (
    <header className="glass border-b border-gray-200/80 sticky top-0 z-50">
      {/* メインナビ */}
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="text-xl font-bold text-gradient">AIビジネス解剖室</span>
          <span className="hidden sm:inline text-xs text-gray-400 border border-gray-200 rounded px-2 py-0.5">
            既存ビジネス×AI自動化の設計図
          </span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-gray-500">
          <Link href="/search" className="hover:text-gray-900 transition-colors flex items-center gap-1">
            <span>🔍</span>
            <span className="hidden sm:inline">検索</span>
          </Link>
          <Link href="/articles" className="hover:text-gray-900 transition-colors">記事一覧</Link>
          <Link href="/about" className="hover:text-gray-900 transition-colors">このサイトについて</Link>
          <a
            href="https://twitter.com/ai_biz_kaibou"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-gray-900 text-gray-900 px-3 py-1.5 rounded-full text-xs font-medium hover:bg-gray-900 hover:text-white transition-colors"
          >
            X でフォロー
          </a>
        </nav>
      </div>

      {/* カテゴリナビ */}
      {tags.length > 0 && (
        <div className="border-t border-gray-100 bg-white/80">
          <div className="max-w-5xl mx-auto px-4 h-9 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <Link
              href="/articles"
              className="text-xs text-gray-500 hover:text-gray-900 whitespace-nowrap transition-colors font-medium"
            >
              すべて
            </Link>
            {tags.map(tag => (
              <Link
                key={tag}
                href={`/tags/${encodeURIComponent(tag)}`}
                className="text-xs text-gray-400 hover:text-gray-700 whitespace-nowrap transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
