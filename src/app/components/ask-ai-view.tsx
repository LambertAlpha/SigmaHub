"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createChatConnection, sendMessage } from '@/api/chat'

interface Message {
  id: number
  text: string
  isAi: boolean
  timestamp?: string
}

interface AskAIViewProps {
  initialQuestion?: string;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function AskAIView({ initialQuestion = "", messages, setMessages }: AskAIViewProps) {
  const [input, setInput] = useState("")
  const [hasInitialQuestionSent, setHasInitialQuestionSent] = useState(false)
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialQuestion) {
      setInput(initialQuestion)
    }
  }, [])

  useEffect(() => {
    let wsConnection: WebSocket | null = null
    
    try {
      setIsConnecting(true)
      wsConnection = createChatConnection()
      
      wsConnection.onopen = () => {
        console.log('WebSocket连接已建立')
        setIsConnecting(false)
        if (messages.length === 0) {
          setMessages([{
            id: 1,
            text: "我是你的视频小助手，有什么需要帮助的吗？",
            isAi: true,
          }])
        }
      }

      wsConnection.onmessage = (event: MessageEvent) => {
        const text = event.data
        console.log('收到服务器消息:', text)
        setMessages((prev: Message[]) => {
          const lastMessage = prev[prev.length - 1]
          
          if (lastMessage && lastMessage.isAi) {
            return [
              ...prev.slice(0, -1),
              {
                ...lastMessage,
                text: lastMessage.text + text
              }
            ]
          }
          
          return [...prev, {
            id: prev.length + 1,
            text: text,
            isAi: true,
          }]
        })
      }

      setWs(wsConnection)
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      setError('Failed to establish connection')
      setIsConnecting(false)
    }

    return () => {
      if (wsConnection) {
        wsConnection.close()
      }
    }
  }, [setMessages])

  useEffect(() => {
    if (initialQuestion && !hasInitialQuestionSent && ws?.readyState === WebSocket.OPEN) {
      setMessages((prev: Message[]) => [...prev, {
        id: Date.now(),
        text: initialQuestion,
        isAi: false,
        timestamp: new Date().toISOString()
      }])

      try {
        sendMessage(ws, initialQuestion)
        setInput("")
        setHasInitialQuestionSent(true)
      } catch (err) {
        console.error('Failed to send message:', err)
        setError('Failed to send message')
      }
    }
  }, [initialQuestion, ws, setMessages, hasInitialQuestionSent])

  useEffect(() => {
    setHasInitialQuestionSent(false)
  }, [initialQuestion])

  const handleSend = () => {
    if (!input.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
      setError('Cannot send message: connection not available')
      return
    }

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: input,
      isAi: false,
    }])

    try {
      sendMessage(ws, input)
      setInput("")
      setError(null)
    } catch (err) {
      console.error('Failed to send message:', err)
      setError('Failed to send message')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  if (isConnecting) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-gray-400">Connecting...</div>
      </div>
    )
  }

  return (
    <div suppressHydrationWarning className="h-[calc(100vh-16rem)] overflow-y-auto bg-gray-50 rounded-3xl">
      <div className="flex h-full flex-col">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-2 text-sm">
            {error}
          </div>
        )}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isAi ? "justify-start" : "justify-end"}`}>
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  message.isAi 
                  ? "bg-blue-100 text-gray-800 rounded-tl-none" 
                  : "bg-blue-100 text-gray-800 rounded-tr-none"
                }`}
              >
                {message.text}
              </div>
            </div>
          ))}
        </div>
        <div className="p-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                ?
              </div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask Me Anything"
                className="w-full pl-10 pr-4 py-3 bg-white border-0 rounded-full text-gray-800 placeholder-gray-400"
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!ws || ws.readyState !== WebSocket.OPEN}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6"
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}