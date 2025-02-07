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

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Ask AI</h2>
      <div className="flex h-full flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}>
              <div
                className={`rounded-lg px-4 py-2 ${message.isAi ? "bg-gray-800 text-white" : "bg-blue-600 text-white"}`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-800 p-4">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Anything Here"
              className="flex-1 bg-gray-800"
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend}>Send</Button>
          </div>
        </div>
      </div>
    </div>
  )
}