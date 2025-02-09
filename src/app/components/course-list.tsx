// 首页课程列表
"use client"

import { ChevronRight } from "lucide-react"

interface CourseListProps {
  items: string[]
}

export default function CourseList({ items }: CourseListProps) {
  return (
    <div className="divide-y divide-gray-700/50">
      {items.map((item, index) => (
        <button
          key={index}
          className="w-full px-6 py-4 flex items-center justify-between group hover:bg-gray-800 transition-colors"
        >
          <span className="text-sm text-gray-300 group-hover:text-white">
            {item}
          </span>
          <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-400" />
        </button>
      ))}
    </div>
  )
}