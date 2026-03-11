import { getAllArticles } from '@/lib/articles'
import SearchClient from './SearchClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '記事を検索',
}

export default function SearchPage() {
  const articles = getAllArticles()
  return <SearchClient articles={articles} />
}
