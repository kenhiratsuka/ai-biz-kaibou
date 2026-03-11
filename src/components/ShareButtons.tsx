'use client'

import { useState } from 'react'

interface Props {
  title: string
  slug: string
}

export default function ShareButtons({ title, slug }: Props) {
  const [copied, setCopied] = useState(false)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ai-biz-kaibou.vercel.app'
  const url = `${siteUrl}/articles/${slug}`
  const xText = encodeURIComponent(`${title}\n\n#AIビジネス解剖室 #AI副業`)

  const handleCopy = () => {
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2 mb-6">
      <span className="text-xs text-gray-400">シェア：</span>
      <a
        href={`https://twitter.com/intent/tweet?text=${xText}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1 text-xs bg-gray-900 text-white px-3 py-1.5 rounded-full hover:bg-gray-700 transition-colors"
      >
        𝕏 でシェア
      </a>
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 text-xs border border-gray-200 text-gray-500 px-3 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
      >
        {copied ? '✓ コピー済み' : '🔗 URLをコピー'}
      </button>
    </div>
  )
}
