"use client"

interface Question {
  id: number
  question: string
  options: {
    label: string
    text: string
  }[]
}

export function PracticeView() {
  // Sample questions - in real app, these would be generated from video content
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the definition of Sociology",
      options: [
        { label: "A", text: "content here A is a wrong answer" },
        { label: "B", text: "content here A is a wrong answer" },
        { label: "C", text: "content here A is a wrong answer" },
        { label: "D", text: "content here A is a wrong answer" },
      ],
    },
    {
      id: 2,
      question: "What is the definition of Sociology",
      options: [
        { label: "A", text: "content here A is a wrong answer" },
        { label: "B", text: "content here A is a wrong answer" },
        { label: "C", text: "content here A is a wrong answer" },
        { label: "D", text: "content here A is a wrong answer" },
      ],
    },
  ]

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Practice Mode</h2>
      {/* 添加练习模式的内容 */}
    </div>
  )
}