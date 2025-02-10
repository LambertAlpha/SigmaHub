// 首页
"use client"

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"
import ActivityHeatmap from "./components/activity-heatmap"
import { RankingDialog } from "@/components/ranking-dialog"
import { useState } from "react"

interface Course {
  id: string
  title: string
  imageUrl: string
}

export default function Home() {
  const [showRanking, setShowRanking] = useState(false)
  const courses: Course[] = [
    { id: '1', title: '中美变革与AI革命', imageUrl: '/courses_images/course1.jpg' },
    { id: '2', title: '区块链与比特币', imageUrl: '/courses_images/course2.jpg' },
    { id: '3', title: '三分钟认识SCI', imageUrl: '/courses_images/course3.jpg' },
    { id: '4', title: '磁场的本质', imageUrl: '/courses_images/course4.jpg' },
    { id: '5', title: '为什么要早睡', imageUrl: '/courses_images/course5.jpg' },
    { id: '6', title: '创意写作', imageUrl: '/courses_images/course6.jpg' },
    { id: '7', title: '金融基础', imageUrl: '/courses_images/course7.jpg' },
    { id: '8', title: '区块链基础', imageUrl: '/courses_images/course8.jpg' },
    { id: '9', title: '用户体验设计', imageUrl: '/courses_images/course9.jpg' },
    { id: '10', title: '可持续发展', imageUrl: '/courses_images/course10.jpg' },
    { id: '11', title: '公众演讲', imageUrl: '/courses_images/course11.jpg' },
    { id: '12', title: '摄影艺术', imageUrl: '/courses_images/course12.jpg' },
    { id: '13', title: '移动开发', imageUrl: '/courses_images/course13.jpg' },
    { id: '14', title: '社交媒体', imageUrl: '/courses_images/course14.jpg' },
  ]

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* 左侧 - 用户信息区域 */}
          <div className="flex flex-col h-full">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-48 h-48">
                <Image 
                  src="/avatar.jpg"
                  alt="User avatar"
                  fill
                  className="rounded-full object-cover shadow-lg border-4 border-white"
                />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Weston Guo</h1>
              <div className="grid grid-cols-2 gap-2 w-full max-w-[280px]">
                {Array(7).fill('Best Learner Ever').map((badge, index) => (
                  <span 
                    key={index}
                    className={`px-3 py-1.5 rounded-full text-xs text-center ${
                      [0, 3, 5].includes(index)
                        ? "bg-[#00BFB3] text-white" 
                        : [1, 4].includes(index)
                        ? "bg-[#3B82F6] text-white"
                        : "bg-[#34D399] text-white"
                    }`}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex-grow" />
            
            <Button 
              className="w-[180px] mx-auto bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2.5 text-sm shadow-md rounded-full mb-8"
              onClick={() => setShowRanking(true)}
            >
              Ranking
            </Button>
          </div>

          {/* 右侧 - 课程网格和学习历史 */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {courses.map((course, index) => (
                <Link 
                  href={`/course${course.id}`} 
                  key={index}
                >
                  <Card className="group overflow-hidden border border-gray-200 hover:border-blue-500 transition-all rounded-xl">
                    <div className="aspect-video relative bg-gray-50">
                      <div className="absolute inset-0 bg-gray-900/10"></div>
                      <Image
                        src={course.imageUrl}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-3 bg-white">
                      <h3 className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">{course.title}</h3>
                    </div>
                  </Card>
                </Link>
              ))}
              <Link href="/course">
                <Card className="flex items-center justify-center aspect-[1.5] bg-gray-900/5 border border-gray-300 border-dashed hover:bg-gray-900/10 hover:border-blue-500 transition-all">
                  <div className="text-center">
                    <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                    <span className="text-gray-600">New Course</span>
                  </div>
                </Card>
              </Link>
            </div>

            {/* 学习历史图表 */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-gray-900 font-medium">My Study History Chart</h2>
                <span className="text-sm text-gray-500">accumulated learning result</span>
              </div>
              <ActivityHeatmap />
            </div>
          </div>
        </div>
      </div>

      <RankingDialog 
        open={showRanking} 
        onOpenChange={setShowRanking}
      />
    </main>
  )
}