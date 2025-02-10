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

type View = "practice" | "summary" | "askAi"

export default function CoursePage() {
  const [mounted, setMounted] = useState(false)
  const [currentView, setCurrentView] = useState<View>("practice")
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [timestamp, setTimestamp] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

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
      setError('Please upload a video file')
      return
    }

      // 创建本地视频URL
    setVideoUrl(URL.createObjectURL(file))

    try {
      setIsUploading(true)
      setError(null)
      const response = await uploadVideoFile(file)
      // setTimestamp(response.data.timestamp)
      // setTimestamp("20250208163707")
    } catch (err) {
      //setError('Failed to upload video')
      console.error(err)
    } finally {
      setIsUploading(false)
    }
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

  console.log('传递给 SummaryView 的 timestamp:', timestamp || "20250210021255");

  return (
    <div suppressHydrationWarning className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">
              Course Name: <span className="text-blue-500">心理学与生活</span>
            </h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentView === "practice" ? "default" : "secondary"}
              onClick={() => setCurrentView("practice")}
            >
              Practice
            </Button>
            <Button
              variant={currentView === "summary" ? "default" : "secondary"}
              onClick={() => setCurrentView("summary")}
            >
              Summary
            </Button>
            <Button variant={currentView === "askAi" ? "default" : "secondary"} onClick={() => setCurrentView("askAi")}>
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
              border-2 border-dashed rounded-lg
              flex flex-col items-center justify-center
              min-h-[400px] transition-colors
              ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700"}
              ${isUploading ? "opacity-50" : ""}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {isUploading ? (
              <div className="text-gray-400">Uploading...</div>
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
                <p className="text-lg text-gray-400">将视频文件拖放到这里</p>
                <p className="text-sm text-gray-500 mt-2">支持 MP4, WebM, Ogg 格式</p>
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-500/10 text-red-400 px-4 py-2 rounded">
              {error}
            </div>
          )}

          {timestamp && (
            <div className="bg-green-500/10 text-green-400 px-4 py-2 rounded">
              Video uploaded successfully!
            </div>
          )}

          {/* Notes Area */}
          <Textarea placeholder="Type your notes here..." className="min-h-[200px] bg-gray-800 border-gray-700" />
        </div>

        {/* Right Panel */}
        <div className="bg-gray-800 rounded-lg">
          {currentView === "practice" && <PracticeView timestamp="20250210021255" />}
          {currentView === "summary" && <SummaryView timestamp="20250210021255" />}
          {currentView === "askAi" && <AskAIView />}
        </div>
      </div>
    </div>
  )
}