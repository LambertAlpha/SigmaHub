"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState, useEffect } from "react"
import { PracticeView } from "@/app/components/practice-view"
import { SummaryView } from "@/app/components/summary-view"
import { AskAIView } from "@/app/components/ask-ai-view"
import { uploadVideo, uploadVideoFile } from "@/api/index"
import { AllSummary } from "@/app/components/all-summary"

// 添加 Message 接口定义
interface Message {
  id: number
  text: string
  isAi: boolean
  timestamp?: string
}

type View = "practice" | "summary" | "askAi"

export default function CoursePage() {
  const [mounted, setMounted] = useState(false)
  const [currentView, setCurrentView] = useState<View>("summary")
  const [currentQuestion, setCurrentQuestion] = useState<string>("")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [timestamp, setTimestamp] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string>("")
  const [messages, setMessages] = useState<Message[]>([])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length === 0) return
    
    const file = files[0]
    if (!file.type.startsWith('video/')) {
      setError('请上传视频文件')
      return
    }

    setVideoUrl(URL.createObjectURL(file))

    try {
      setIsUploading(true)
      setError(null)
      const response = await uploadVideoFile(file)
      console.log("Upload response:", response);
      setTimestamp(response.data.timestamp)
    } catch (err) {
      setError('上传视频失败，请重试')
      console.error("Upload error:", err)
    } finally {
      setIsUploading(false)
    }
  }

  const handleSwitchToAskAI = (question: string) => {
    setCurrentQuestion(question);
    setCurrentView("askAi");
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  if (!mounted) {
    return null
  }

  return (
    <div suppressHydrationWarning className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <div className="p-4 bg-gray-50">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="hover:bg-transparent bg-transparent">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">
              Default
            </h1>
          </div>
          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={() => setCurrentView("summary")}
              className={`px-4 py-2 transition-all hover:bg-transparent bg-transparent ${
                currentView === "summary" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
              }`}
            >
              Keywords
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("practice")}
              className={`px-4 py-2 transition-all hover:bg-transparent bg-transparent ${
                currentView === "practice" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
              }`}
            >
              Practice
            </Button>
            <Button
              variant="ghost"
              onClick={() => setCurrentView("askAi")}
              className={`px-4 py-2 transition-all hover:bg-transparent bg-transparent ${
                currentView === "askAi" 
                ? "text-blue-600 border-b-2 border-blue-600" 
                : "text-gray-500 hover:text-blue-600 hover:border-b-2 hover:border-blue-600"
              }`}
            >
              Ask AI
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4">
          {/* File Drop Zone / Video Player Container */}
          <div
            className={`
              rounded-3xl
              flex flex-col items-center justify-center
              min-h-[400px] transition-colors
              ${isDragging ? "bg-blue-50" : "bg-gray-100"}
              ${isUploading ? "opacity-50" : ""}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="text-gray-600">上传中...</div>
            ) : videoUrl ? (
              // 视频播放器
              <div className="w-full h-full">
                <video
                  className="w-full h-full object-contain"
                  controls
                  src={videoUrl}
                  controlsList="nodownload"
                >
                  您的浏览器不支持视频播放。
                </video>
              </div>
            ) : (
              // 上传提示
              <>
                <div className="w-16 h-16 mb-4">
                  <svg 
                    className="w-full h-full text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M12 4v16m8-8H4" 
                    />
                  </svg>
                </div>
                <p className="text-lg text-gray-600">将视频文件拖放到这里</p>
                <p className="text-sm text-gray-500 mt-2">支持 MP4, WebM, Ogg 格式</p>
              </>
            )}
          </div>

          {error && (
            <div className="text-red-600 px-4 py-2">
              {error}
            </div>
          )}

          {timestamp && (
            <div className="text-green-600 px-4 py-2">
              视频上传成功！
            </div>
          )}

          {/* Replace Textarea with AllSummary */}
          <AllSummary timestamp={timestamp || ""} />
        </div>

        {/* Right Panel */}
        <div className="bg-gray-100 rounded-3xl">
          {currentView === "summary" && <SummaryView timestamp={timestamp || ""} />}
          {currentView === "practice" && (
            <PracticeView 
              timestamp={timestamp || ""} 
              onSwitchToAskAI={handleSwitchToAskAI}
            />
          )}
          {currentView === "askAi" && (
            <AskAIView 
              initialQuestion={currentQuestion}
              messages={messages}
              setMessages={setMessages}
            />
          )}
        </div>
      </div>
    </div>
  )
}