import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'このサイトについて',
}

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto prose prose-gray">
      <h1>AIビジネス解剖室について</h1>
      <p>
        AIビジネス解剖室は、「既存ビジネスをAIで自動化して個人が収益化する方法」を深掘り解説するメディアです。
        副業を検討している会社員やフリーランスが、記事を読んで具体的に行動できる状態になることを目指しています。
      </p>
      <h2>掲載方針</h2>
      <ul>
        <li>AIを使って自動化できる既存ビジネスモデルを毎日1〜2本解説</li>
        <li>「なぜ今なのか」「いくら稼げるか」「何がボトルネックか」まで踏み込む</li>
        <li>海外のAI活用事例やトレンドをもとにAIが執筆・編集</li>
        <li>収益試算・自動化設計は参考値です。実際の結果は個人差があります</li>
      </ul>
      <h2>お問い合わせ</h2>
      <p>
        X（Twitter）の{' '}
        <a href="https://twitter.com/ai_biz_kaibou" target="_blank" rel="noopener noreferrer">
          @ai_biz_kaibou
        </a>{' '}
        までDMをお送りください。
      </p>
    </div>
  )
}
