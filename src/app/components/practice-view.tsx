"use client"

import { useEffect, useState } from "react"
import { getQuestions } from "@/api/index"

interface Question {
  id: number
  question: string
  options: {
    label: string
    text: string
  }[]
}

interface PracticeViewProps {
  timestamp: string | null
}

export function PracticeView({ timestamp }: PracticeViewProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchQuestions() {
      if (!timestamp) return

      try {
        setLoading(true)
        setError(null)
        const data = await getQuestions(timestamp)
        setQuestions(data.data)
      } catch (err) {
        setError('Failed to load questions')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [timestamp])

  if (!timestamp) {
    return (
      <div className="p-4 text-gray-400">
        Upload a video to see practice questions
      </div>
    )
  }

  if (loading) {
    return (
      <div className="p-4 text-gray-400">
        Loading questions...
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

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Practice Questions</h2>
      <div className="space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-3">
            <p className="font-medium">{question.question}</p>
            <div className="space-y-2">
              {question.options.map((option) => (
                <button
                  key={option.label}
                  className="w-full text-left p-3 rounded bg-gray-700/50 hover:bg-gray-700 transition-colors"
                >
                  <span className="font-medium mr-2">{option.label}.</span>
                  {option.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}