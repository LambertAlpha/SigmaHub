// 首页用户活动热力图组件(类似github的贡献图)
"use client"

import { useEffect, useState } from "react"

export default function ActivityHeatmap() {
  const [heatmapData, setHeatmapData] = useState<boolean[][]>([])

  useEffect(() => {
    // Generate sample heatmap data (7 rows x 14 columns)
    const data = Array(7)
      .fill(0)
      .map(() =>
        Array(14)
          .fill(0)
          .map(() => false),
      )
    setHeatmapData(data)
  }, [])

  return (
    <div className="w-full max-w-md">
      <div className="text-sm text-gray-400 mb-2">accumulated learning result</div>
      <div className="grid grid-cols-14 gap-1">
        {Array.from({ length: 98 }).map((_, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${
              Math.random() > 0.7 
                ? 'bg-blue-500/50' 
                : 'bg-gray-700/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}