"use client"

import { useEffect, useState } from "react"
import { getSummary } from "@/api/index"

interface Summary {
  keywords: string[]
  summary: string
}

interface SummaryViewProps {
  timestamp: string | null
}

export function SummaryView({ timestamp }: SummaryViewProps) {
  const [summary, setSummary] = useState<Summary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSummary() {
      if (!timestamp) return

      try {
        setLoading(true)
        setError(null)
        const data = await getSummary(timestamp, timestamp)
        setSummary(data.data)
      } catch (err) {
        setError('Failed to load summary')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchSummary()
  }, [timestamp])

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
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Summary</h2>
      <div className="space-y-6">
        <div>
          <h3 className="mb-3 text-sm text-gray-400">Keywords:</h3>
          <div className="flex flex-wrap gap-2">
            {summary.keywords.map((keyword) => (
              <span key={keyword} className="rounded-full bg-gray-700 px-3 py-1 text-sm">
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm text-gray-400">Summary:</h3>
          <p className="text-sm text-gray-100">
            {summary.summary}
          </p>
        </div>
      </div>
    </div>
  )
}  