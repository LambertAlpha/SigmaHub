// 首页用户活动热力图组件(类似github的贡献图)
"use client"

import { useEffect, useState } from "react"

interface ActivityHeatmapProps {
  className?: string
}

export default function ActivityHeatmap({ className = "" }: ActivityHeatmapProps) {
  const [heatmapData, setHeatmapData] = useState<number[][]>([])

  useEffect(() => {
    // 生成示例热力图数据 (7行 x 52列，代表一年)
    const data = Array(7)
      .fill(0)
      .map(() =>
        Array(52)
          .fill(0)
          .map(() => {
            // 调整概率分布，使大部分为0和1，较少为2和3
            const rand = Math.random()
            if (rand < 0.6) return 0 // 60%概率为0
            if (rand < 0.85) return 1 // 25%概率为1
            if (rand < 0.95) return 2 // 10%概率为2
            return 3 // 5%概率为3
          })
      )
    setHeatmapData(data)
  }, [])

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "bg-gray-200"
      case 1:
        return "bg-blue-300"
      case 2:
        return "bg-blue-500"
      case 3:
        return "bg-blue-700"
      default:
        return "bg-gray-200"
    }
  }

  const getHours = (intensity: number) => {
    switch (intensity) {
      case 0:
        return "0h"
      case 1:
        return "1h"
      case 2:
        return "2h"
      case 3:
        return "3h"
      default:
        return "0h"
    }
  }

  const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-2">
        {/* <div className="flex flex-col justify-around text-xs text-gray-400 pr-2">
          {weekDays.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div> */}
        <div className="flex-1">
          <div className="grid grid-rows-7 grid-flow-col gap-1">
            {heatmapData.map((row, i) =>
              row.map((intensity, j) => (
                <div
                  key={`${i}-${j}`}
                  className={`w-3 h-3 rounded-lg ${getColor(intensity)} transition-colors duration-200 hover:ring-2 hover:ring-blue-300 group relative`}
                >
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {getHours(intensity)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* <div className="flex justify-end items-center gap-2 mt-2">
        <span className="text-xs text-gray-400">活动强度：</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3].map((level) => (
            <div
              key={level}
              className={`w-3 h-3 rounded-sm ${getColor(level)}`}
              title={`Level ${level}`}
            />
          ))}
        </div>
      </div> */}
    </div>
  )
}