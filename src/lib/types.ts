export interface ArticleFrontmatter {
  title: string
  published_at: string
  tags: string[]
  business_category: string
  automation_level: '高' | '中' | '低'
  monthly_revenue_range: string
  initial_cost: string
  summary: string
  sources: string[]
  slug: string
}

export interface Article extends ArticleFrontmatter {
  content: string
  readingTime: string
}
