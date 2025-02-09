// 首页用户活动热力图组件(类似github的贡献图)
"use client"

import { useEffect, useState } from "react"

interface ActivityData {
  active: boolean
  date: string
}

export default function ActivityHeatmap() {
  const [heatmapData, setHeatmapData] = useState<ActivityData[]>([])

  useEffect(() => {
    // 生成固定的数据而不是随机数据
    const generateInitialData = () => {
      const data: ActivityData[] = []
      const today = new Date()
      
      for (let i = 0; i < 98; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() - i)
        data.push({
          active: i % 3 === 0, // 使用固定的模式而不是随机值
          date: date.toISOString().split('T')[0]
        })
      }
      
      setHeatmapData(data)
    }

    generateInitialData()
  }, [])

  return (
    <div className="w-full max-w-md">
      <div className="text-sm text-gray-400 mb-2">accumulated learning result</div>
      <div className="grid grid-cols-14 gap-1">
        {heatmapData.map((item, i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-sm ${
              item.active ? 'bg-blue-500/50' : 'bg-gray-700/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}