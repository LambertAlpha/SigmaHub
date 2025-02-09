// 首页
"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import ActivityHeatmap from "./components/activity-heatmap"
import CourseList from "./components/course-list"
import Link from "next/link"

export default function Page() {
  return (
    <div suppressHydrationWarning className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Left Column - Profile Section */}
          <div className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <img
                  src="./././avatar.jpg"
                  alt="Profile avatar"
                  className="w-[32rem] aspect-square rounded-full" // 使用 aspect-square 确保宽高比 1:1 呈现完美圆形
                />
              </div>
              <h1 className="text-2xl font-bold">WestOn Guo</h1>
            </div>
            <ActivityHeatmap />
          </div>

          {/* Right Column - History Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">History</h2>
              <Link href="/course">
                <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white">
                  <Plus className="h-6 w-6" />
                </Button>
              </Link>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm text-gray-400">Last Three days</h3>
              <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                <CourseList items={["Interactive Proofs and the Sum-Check Protocol"]} />
              </Card>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm text-gray-400">Last Month</h3>
              <div className="space-y-2">
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CourseList items={["Basic Macroeconomic Concepts"]} />
                </Card>
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CourseList items={["Large Bipartite Subgraph"]} />
                </Card>
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CourseList items={["Introduction to Superposition"]} />
                </Card>
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CourseList items={["Operators and the Schrödinger Equation"]} />
                </Card>
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CourseList items={["MIT Introduction to Deep Learning"]} />
                </Card>
                <Card className="bg-gray-800 hover:bg-gray-700 transition-colors">
                  <CourseList items={["MIT Calculus 101"]} />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}