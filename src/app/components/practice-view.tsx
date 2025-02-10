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
  explanations?: { option: string; explanation: string }[];
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
  timestamp: number | string;
  onSwitchToAskAI?: (question: string) => void;  // 添加新的 prop
}

export function PracticeView({ timestamp, onSwitchToAskAI }: PracticeViewProps) {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnswers, setSelectedAnswers] = useState<{[key: number]: string}>({})
  const [answerResults, setAnswerResults] = useState<{[key: number]: boolean}>({})
  const [questionLocked, setQuestionLocked] = useState<{[key: number]: boolean}>({})  // 新增：记录题目是否已锁定
  const [showExplanation, setShowExplanation] = useState<{[key: number]: boolean}>({})  // 新增：控制解释框的显示

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
    if (questionLocked[questionIndex]) {
      return
    }

    setSelectedAnswers(prev => ({
      ...prev,
      [questionIndex]: option
    }))

    const isCorrect = option === questions[questionIndex].answer
    setAnswerResults(prev => ({
      ...prev,
      [questionIndex]: isCorrect
    }))
    setQuestionLocked(prev => ({
      ...prev,
      [questionIndex]: true
    }))

    // 如果答错，显示解释框
    if (!isCorrect) {
      setShowExplanation(prev => ({
        ...prev,
        [questionIndex]: true
      }))
    }
  }

  const handleAskAI = (question: string) => {
    if (onSwitchToAskAI) {
      onSwitchToAskAI("");
    }
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
          <div key={index} className="mb-6 p-4 bg-gray-100 rounded-lg">
            <p className="mb-2">
              <span className="font-bold mr-2">第 {index + 1} 题：</span>
              {question.question}
            </p>
            {question.type === 'multiple_choice' && (
              <div className="space-y-2">
                {question.options?.map(option => {
                  const isSelected = selectedAnswers[index] === option
                  const isCorrect = option === question.answer
                  const isLocked = questionLocked[index]
                  const shouldShowCorrect = isLocked && isCorrect
                  const shouldShowWrong = isLocked && isSelected && !isCorrect
                  
                  return (
                    <div 
                      key={option} 
                      className={`flex items-center p-3 rounded-full border ${
                        isLocked ? 'cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'
                      } ${
                        shouldShowCorrect
                          ? 'border-blue-500 bg-blue-100'
                          : shouldShowWrong
                            ? 'border-red-500 bg-red-50'
                            : isSelected
                              ? 'border-blue-500 bg-blue-100'
                              : 'border-gray-200 bg-white'
                      }`}
                      onClick={() => handleOptionSelect(index, option)}
                    >
                      <div className="flex items-center w-full">
                        <div className={`w-5 h-5 border-2 rounded-full flex items-center justify-center mr-3 ${
                          shouldShowCorrect
                            ? 'border-blue-500'
                            : shouldShowWrong
                              ? 'border-red-500'
                              : isSelected
                                ? 'border-blue-500'
                                : 'border-gray-300'
                        }`}>
                          {(isSelected || shouldShowCorrect) && (
                            <div className={`w-2.5 h-2.5 rounded-full ${
                              shouldShowCorrect
                                ? 'bg-blue-500'
                                : shouldShowWrong
                                  ? 'bg-red-500'
                                  : 'bg-blue-500'
                            }`}></div>
                          )}
                        </div>
                        <span className={`text-sm ${
                          shouldShowCorrect
                            ? 'text-blue-700'
                            : shouldShowWrong
                              ? 'text-red-700'
                              : isSelected
                                ? 'text-blue-700'
                                : 'text-gray-700'
                        }`}>{option}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
            {question.type === 'fill_in_the_blank' && (
              <input
                type="text"
                className="mt-2 w-full p-2 bg-white border border-gray-200 rounded"
                placeholder="请输入答案"
              />
            )}
            
            {/* 新增：解释框 */}
            {showExplanation[index] && (
              <div className="mt-4 p-4 bg-blue-100 rounded-2xl relative">
                <p className="text-gray-800">
                  {question.explanations?.find(exp => exp.option === selectedAnswers[index])?.explanation || 
                   question.explanations?.find(exp => exp.option === question.answer)?.explanation}
                </p>
                <button
                  onClick={() => handleAskAI(question.question)}
                  className="absolute bottom-2 right-2 text-blue-600 hover:text-blue-700 text-sm"
                >
                  Ask ai
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}