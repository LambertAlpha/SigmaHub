"use client"

import { useEffect, useState } from "react"
import { getQuestions } from "@/api/index"

interface Question {
  question: string;
  options?: string[];  // 选择题才有选项
  answer: string;
  time_range: {
    start_time: number;
    end_time: number;
  };
}

interface PracticeViewProps {
  timestamp: number | string
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
        const response = await getQuestions(timestamp.toString())
        
        if (response?.problem_info?.exercises) {
          const { multiple_choice = [], fill_in_the_blanks = [] } = response.problem_info.exercises;
          
          const allQuestions = [
            ...multiple_choice.map(q => ({
              ...q,
              type: 'multiple_choice' as const
            })),
            ...fill_in_the_blanks.map(q => ({
              ...q,
              type: 'fill_in_the_blank' as const
            }))
          ];
          
          setQuestions(allQuestions);
        } else {
          console.error('No exercises found in response:', response)
          setError('No exercises found in response')
        }
      } catch (err) {
        console.error('详细错误信息:', err)
        setError(err instanceof Error ? err.message : 'Failed to load questions')
      } finally {
        setLoading(false)
      }
    }

    // 只在组件挂载时请求一次
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
      <h2 className="text-xl font-bold mb-4">练习题</h2>
      {questions.map((question, index) => (
        <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
          <p className="mb-2">{question.question}</p>
          {question.type === 'multiple_choice' && (
            <div className="space-y-2">
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center">
                  <input
                    type="radio"
                    name={`question-${index}`}
                    id={`q${index}-opt${optIndex}`}
                    className="mr-2"
                  />
                  <label htmlFor={`q${index}-opt${optIndex}`}>{option}</label>
                </div>
              ))}
            </div>
          )}
          {question.type === 'fill_in_the_blank' && (
            <input
              type="text"
              className="mt-2 w-full p-2 bg-gray-700 rounded"
              placeholder="请输入答案"
            />
          )}
        </div>
      ))}
    </div>
  )
}