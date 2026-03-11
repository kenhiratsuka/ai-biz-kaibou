interface Props {
  businessCategory: string
  automationLevel: '高' | '中' | '低'
  monthlyRevenueRange: string
  initialCost: string
}

const LEVEL_CONFIG = {
  '高': { color: '#10b981', bg: '#ecfdf5', label: '自動化率 高', bar: 85 },
  '中': { color: '#f59e0b', bg: '#fffbeb', label: '自動化率 中', bar: 55 },
  '低': { color: '#ef4444', bg: '#fef2f2', label: '自動化率 低', bar: 25 },
}

export default function BusinessModelDiagram({
  businessCategory,
  automationLevel,
  monthlyRevenueRange,
  initialCost,
}: Props) {
  const level = LEVEL_CONFIG[automationLevel] ?? LEVEL_CONFIG['中']

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6 mb-8">
      <p className="text-xs font-medium text-gray-400 mb-4 uppercase tracking-wide">Business Model</p>

      {/* フロー図 */}
      <div className="flex items-center justify-between gap-2 mb-6">
        {/* クライアント */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-3 text-center shadow-sm">
          <div className="text-lg mb-1">🏢</div>
          <div className="text-xs text-gray-500 font-medium">クライアント</div>
        </div>

        {/* 矢印 */}
        <div className="flex flex-col items-center text-gray-300 shrink-0">
          <div className="text-xs text-gray-400 mb-1 whitespace-nowrap">依頼</div>
          <div className="text-lg">→</div>
        </div>

        {/* あなた＋AI */}
        <div className="flex-1 border rounded-xl p-3 text-center shadow-sm" style={{ backgroundColor: level.bg, borderColor: level.color + '40' }}>
          <div className="text-lg mb-1">🤖</div>
          <div className="text-xs font-bold" style={{ color: level.color }}>あなた＋AI</div>
          <div className="text-xs text-gray-500">{businessCategory}</div>
        </div>

        {/* 矢印 */}
        <div className="flex flex-col items-center text-gray-300 shrink-0">
          <div className="text-xs text-gray-400 mb-1 whitespace-nowrap">納品</div>
          <div className="text-lg">→</div>
        </div>

        {/* 収益 */}
        <div className="flex-1 bg-white border border-emerald-200 rounded-xl p-3 text-center shadow-sm">
          <div className="text-lg mb-1">💰</div>
          <div className="text-xs font-bold text-emerald-600">{monthlyRevenueRange}</div>
          <div className="text-xs text-gray-400">想定月収</div>
        </div>
      </div>

      {/* 自動化レベルバー */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>{level.label}</span>
          <span>初期費用：{initialCost}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full transition-all"
            style={{ width: `${level.bar}%`, backgroundColor: level.color }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400">
          <span>手動作業が多い</span>
          <span>ほぼ自動</span>
        </div>
      </div>
    </div>
  )
}
