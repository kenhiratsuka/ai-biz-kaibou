import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-gray-500 mb-6">ページが見つかりませんでした</p>
      <Link href="/" className="text-blue-600 hover:underline">トップに戻る →</Link>
    </div>
  )
}
