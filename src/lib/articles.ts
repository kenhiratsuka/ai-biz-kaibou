import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { ArticleFrontmatter, Article } from './types'

const ARTICLES_DIR = path.join(process.cwd(), 'content/articles')

function calcReadingTime(text: string): string {
  const words = text.split(/\s+/).length
  const mins = Math.ceil(words / 200)
  return `約${mins}分`
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(ARTICLES_DIR)) return []

  const files = fs.readdirSync(ARTICLES_DIR)
    .filter(f => f.endsWith('.mdx') || f.endsWith('.md'))

  const articles = files.map(filename => {
    const filePath = path.join(ARTICLES_DIR, filename)
    const slug = filename.replace(/\.(mdx|md)$/, '')
    const raw = fs.readFileSync(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const mtime = fs.statSync(filePath).mtimeMs
    return {
      ...(data as ArticleFrontmatter),
      slug,
      content,
      readingTime: calcReadingTime(content),
      _mtime: mtime,
    }
  })

  return articles
    .sort((a, b) => {
      const dateDiff = new Date(b.published_at).getTime() - new Date(a.published_at).getTime()
      if (dateDiff !== 0) return dateDiff
      return b._mtime - a._mtime
    })
    .map(({ _mtime, ...rest }) => rest) as Article[]
}

export function getArticleBySlug(slug: string): Article | null {
  const filePath = path.join(ARTICLES_DIR, `${slug}.mdx`)
  const altPath = path.join(ARTICLES_DIR, `${slug}.md`)

  const targetPath = fs.existsSync(filePath) ? filePath : fs.existsSync(altPath) ? altPath : null
  if (!targetPath) return null

  const raw = fs.readFileSync(targetPath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    ...(data as ArticleFrontmatter),
    slug,
    content,
    readingTime: calcReadingTime(content),
  }
}

export function getAllTags(): string[] {
  const articles = getAllArticles()
  const tags = new Set<string>()
  articles.forEach(a => a.tags?.forEach(t => tags.add(t)))
  return Array.from(tags).sort()
}

export function getRelatedArticles(slug: string, tags: string[], limit = 3): Article[] {
  const all = getAllArticles()
  return all
    .filter(a => a.slug !== slug && a.tags?.some(t => tags.includes(t)))
    .slice(0, limit)
}
