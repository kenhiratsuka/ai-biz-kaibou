'use client'

import { useState } from 'react'
import { Article } from '@/lib/types'
import ArticleCard from '@/components/ArticleCard'

export default function SearchClient({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState('')

  const results = query.trim().length === 0 ? [] : articles.filter(a => {
    const q = query.toLowerCase()
    return (
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.business_category.toLowerCase().includes(q) ||
      a.tags.some(t => t.toLowerCase().includes(q))
    )
  })

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">記事を検索</h1>

      <div className="relative mb-8">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="キーワードを入力（例：SNS、自動化、不動産）"
          className="w-full border border-gray-200 rounded-2xl px-5 py-4 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          autoFocus
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
      </div>

      {query.trim().length > 0 && (
        <p className="text-sm text-gray-400 mb-4">
          「{query}」の検索結果：{results.length}件
        </p>
      )}

      {results.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {results.map(a => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}

      {query.trim().length > 0 && results.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-4">🔍</p>
          <p>「{query}」に一致する記事が見つかりませんでした。</p>
        </div>
      )}

      {query.trim().length === 0 && (
        <div className="text-center py-16 text-gray-300">
          <p className="text-4xl mb-4">🔍</p>
          <p>キーワードを入力してください</p>
        </div>
      )}
    </div>
  )
}
