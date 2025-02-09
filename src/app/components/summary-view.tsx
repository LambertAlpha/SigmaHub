"use client"

import { useEffect, useState } from "react"
import { getSummary } from "@/api/index"

interface Summary {
  keywords: string[]
  summary: string
}

interface SummaryViewProps {
  timestamp: "20250208163707"
}

export function SummaryView({ timestamp }: SummaryViewProps) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chapters, setChapters] = useState<any[]>([])

  useEffect(() => {
    async function fetchSummary() {
      console.log('当前 timestamp:', timestamp);
      if (!timestamp) {
        console.log('没有 timestamp，跳过请求');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('开始请求摘要数据...');
        const response = await getSummary(timestamp);
        console.log('API 响应数据:', response);

        if (!response) {
          console.error('响应为空');
          setError('Empty response');
          return;
        }

        if (!response.summary_info) {
          console.error('没有 summary_info');
          setError('No summary info found');
          return;
        }

        if (!response.summary_info.chapters) {
          console.error('没有 chapters 数据');
          setError('No chapters found');
          return;
        }

        console.log('找到章节数据:', response.summary_info.chapters);
        setChapters(response.summary_info.chapters);
        console.log('章节数据已设置，长度:', response.summary_info.chapters.length);

        setSummary(response.summary_info)
      } catch (err) {
        console.error('获取摘要数据失败:', err);
        setError(err instanceof Error ? err.message : 'Failed to load summary');
      } finally {
        setLoading(false);
      }
    }

    fetchSummary();
  }, [timestamp]);

  console.log('组件渲染状态:', {
    timestamp,
    chaptersLength: chapters.length,
    isLoading: loading,
    error,
  });

  if (!timestamp) {
    return (
      <div className="p-4 text-gray-400">
        Upload a video to see summary
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 text-gray-400">
        Loading summary...
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 text-red-400">
        {error}
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="p-4 space-y-6 text-white">
      {loading && (
        <div className="text-blue-400">加载中...</div>
      )}
      
      {error && (
        <div className="text-red-500">错误: {error}</div>
      )}

      {!loading && !error && chapters.length > 0 && (
        <>
          {/* Keywords Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Keywords in the video:</h2>
            <div className="flex flex-wrap gap-2">
              {/* 收集所有章节的关键词并去重 */}
              {Array.from(new Set(chapters.flatMap(chapter => chapter.keywords))).map((keyword, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-gray-700 rounded-full text-base"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div>
            <h2 className="text-xl font-bold mb-4">Summary:</h2>
            <div className="space-y-4">
              {chapters.map((chapter, index) => (
                <div key={index} className="ml-4 space-y-2">
                  <h3 className="text-lg">• {chapter.title}</h3>
                  <div className="ml-6 space-y-2">
                    <p className="text-gray-300">• {chapter.summary}</p>
                    <p className="text-gray-400 text-sm">
                      {Math.floor(chapter.start_time)}s - {Math.floor(chapter.end_time)}s
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!loading && !error && chapters.length === 0 && (
        <div className="text-yellow-500">暂无章节数据</div>
      )}
    </div>
  )
}  