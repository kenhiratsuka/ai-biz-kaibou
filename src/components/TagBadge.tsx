import Link from 'next/link'

const TAG_COLORS: Record<string, string> = {
  'ローカルビジネス': 'bg-green-50 text-green-600 border-green-100',
  '代行サービス': 'bg-blue-50 text-blue-600 border-blue-100',
  'コンテンツ制作': 'bg-violet-50 text-violet-600 border-violet-100',
  '事務・バックオフィス': 'bg-orange-50 text-orange-600 border-orange-100',
  '営業・マーケ': 'bg-rose-50 text-rose-600 border-rose-100',
  'EC・物販': 'bg-teal-50 text-teal-600 border-teal-100',
  '自動化': 'bg-indigo-50 text-indigo-600 border-indigo-100',
  '副業': 'bg-yellow-50 text-yellow-600 border-yellow-100',
  '士業サポート': 'bg-cyan-50 text-cyan-600 border-cyan-100',
  '採用・HR': 'bg-pink-50 text-pink-600 border-pink-100',
}

export default function TagBadge({ tag }: { tag: string }) {
  const color = TAG_COLORS[tag] ?? 'bg-gray-50 text-gray-500 border-gray-200'
  return (
    <Link
      href={`/tags/${encodeURIComponent(tag)}`}
      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full border ${color} hover:opacity-70 transition-opacity`}
    >
      #{tag}
    </Link>
  )
}
