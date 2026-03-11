import Link from 'next/link'
import { Article } from '@/lib/types'
import TagBadge from './TagBadge'

const AUTOMATION_LEVEL_COLORS: Record<string, string> = {
  '高': 'bg-emerald-50 text-emerald-600 border-emerald-200',
  '中': 'bg-amber-50 text-amber-600 border-amber-200',
  '低': 'bg-red-50 text-red-500 border-red-200',
}

export default function ArticleCard({ article }: { article: Article }) {
  const levelColor = AUTOMATION_LEVEL_COLORS[article.automation_level] ?? 'bg-gray-50 text-gray-500 border-gray-200'

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden card-hover group">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-1">
            {article.tags?.map(tag => (
              <TagBadge key={tag} tag={tag} />
            ))}
          </div>
          {article.automation_level && (
            <span className={`text-xs font-bold whitespace-nowrap border px-2 py-1 rounded-lg ${levelColor}`}>
              自動化：{article.automation_level}
            </span>
          )}
        </div>

        <Link href={`/articles/${article.slug}`}>
          <h2 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug mb-2">
            {article.title}
          </h2>
        </Link>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
          {article.summary}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400">
          {article.monthly_revenue_range && (
            <span className="text-emerald-600 font-bold">{article.monthly_revenue_range}</span>
          )}
          <span className="ml-auto">
            {new Date(article.published_at).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
      </div>
    </article>
  )
}
