"use client"

import * as React from "react"

interface RankingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Learner {
  rank: string
  name: string
}

export function RankingDialog({ open, onOpenChange }: RankingDialogProps) {
  const learners: Learner[] = [
    { rank: "#01", name: "Lambert" },
    { rank: "#02", name: "Taosu" },
    { rank: "#03", name: "Shengsheng" },
    { rank: "#04", name: "Weston Guo" },
    { rank: "#05", name: "Musk" },
    { rank: "#06", name: "Trump" },
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={() => onOpenChange(false)}
      />
      
      {/* 对话框内容 */}
      <div className="relative z-50 w-full max-w-sm bg-white rounded-2xl shadow-lg">
        {/* 标题 */}
        <div className="p-4 border-b border-gray-200 rounded-t-2xl">
          <h2 className="text-lg font-semibold text-center text-gray-900">Ranking</h2>
        </div>

        {/* 内容区域 */}
        <div className="p-4 h-[400px] overflow-auto">
          <div className="space-y-2">
            {learners.map((learner) => (
              <div
                key={learner.rank}
                className={`p-3 rounded-2xl border-2 ${
                  learner.name === "Weston Guo"
                    ? "bg-blue-50 border-blue-300"
                    : "bg-white border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${
                    learner.name === "Weston Guo" ? "text-blue-600" : "text-gray-900"
                  }`}>
                    {learner.rank} {learner.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 关闭按钮 */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  )
} 