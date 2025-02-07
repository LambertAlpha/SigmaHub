"use client"

import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useState } from "react"

export default function CoursePage() {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    // Handle file drop here
    const files = e.dataTransfer.files
    console.log("Dropped files:", files)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Course Name: Default</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="default">Practice</Button>
            <Button variant="default">Summary</Button>
            <Button variant="default">Ask AI</Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4">
        <div className="space-y-4">
          {/* File Drop Zone */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-12
              flex flex-col items-center justify-center
              min-h-[400px] transition-colors
              ${isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700"}
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="w-16 h-16 mb-4">
              <svg className="w-full h-full text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <p className="text-lg text-gray-400">Drag Your File Here</p>
          </div>

          {/* Notes Area */}
          <Textarea placeholder="Type your notes here..." className="min-h-[200px] bg-gray-800 border-gray-700" />
        </div>
      </div>
    </div>
  )
}