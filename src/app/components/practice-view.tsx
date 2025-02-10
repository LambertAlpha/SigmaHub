"use client"

import { useEffect, useState } from "react"
import { getQuestions } from "@/api/index"

interface Question {
  question: string;
  options?: string[];  // 选择题才有选项
  answer: string;
  type: 'multiple_choice' | 'fill_in_the_blank';
  time_range: {
    start_time: number;
    end_time: number;
  };
}

interface QuestionData {
  problem_info: {
    exercises: {
      multiple_choice: Array<Omit<Question, 'type'>>;
      fill_in_the_blanks: Array<Omit<Question, 'type'>>;
    }
  }
}

interface PracticeViewProps {
  timestamp: number | string
}

export function PracticeView({ timestamp }: PracticeViewProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({})  // 添加选中状态管理

  useEffect(() => {
    async function fetchQuestions() {
      if (!timestamp) return

      try {
        setLoading(true)
        setError(null)
        const response = (await getQuestions(timestamp.toString())) as unknown as QuestionData
        
        if (response?.problem_info?.exercises) {
          const { multiple_choice = [], fill_in_the_blanks = [] } = response.problem_info.exercises;
          
          const allQuestions = [
            ...multiple_choice.map((q: Omit<Question, 'type'>) => ({
              ...q,
              type: 'multiple_choice' as const
            })),
            ...fill_in_the_blanks.map((q: Omit<Question, 'type'>) => ({
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

  const handleOptionSelect = (questionIndex: number, option: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }))
  }

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
    <div suppressHydrationWarning className="h-[calc(100vh-16rem)] overflow-y-auto">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">练习题</h2>
        {questions.map((question, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-800 rounded-lg">
            <p className="mb-2">
              <span className="font-bold mr-2">第 {index + 1} 题：</span>
              {question.question}
            </p>
            {question.type === 'multiple_choice' && (
              <div className="space-y-2">
                {question.options?.map((option, optIndex) => (
                  <div 
                    key={optIndex} 
                    className="flex items-center p-4 bg-white/5 rounded-lg hover:bg-white/10 cursor-pointer"
                    onClick={() => handleOptionSelect(index, option)}
                  >
                    <div className="flex items-center w-full cursor-pointer">
                      <div className="w-6 h-6 border-2 border-gray-400 rounded-full flex items-center justify-center mr-3">
                        {selectedAnswers[index] === option && (
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
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
    </div>
  )
}