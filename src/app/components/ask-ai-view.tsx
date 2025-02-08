"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  text: string
  isAi: boolean
}

export function AskAIView() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "OK! Let me think about the blablablablabla",
      isAi: true,
    },
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { id: prev.length + 1, text: input, isAi: false }])
    setInput("")

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: "This is a simulated AI response. In a real application, this would come from an AI model.",
          isAi: true,
        },
      ])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}>
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.isAi ? "bg-gray-700 text-gray-100" : "bg-blue-600 text-white"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-700 p-4">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask anything here..."
            className="flex-1"
          />
          <Button onClick={handleSend}>Send</Button>
        </div>
      </div>
    </div>
  )
}