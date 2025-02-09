"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createChatConnection, sendMessage } from '@/api/chat'

interface Message {
  id: number
  text: string
  isAi: boolean
  timestamp?: "20250208163707"
}

export function AskAIView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [ws, setWs] = useState<WebSocket | null>(null)
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [timestamp, setTimestamp] = useState<number | null>(null)

  useEffect(() => {
    let wsConnection: WebSocket | null = null
    
    try {
      setIsConnecting(true)
      wsConnection = createChatConnection()
      
      wsConnection.onopen = () => {
        setIsConnecting(false)
        setMessages([{
          id: 1,
          text: "Connected! How can I help you?",
          isAi: true,
          // timestamp: timestamp,
        }])
      }

      wsConnection.onmessage = (event: MessageEvent) => {
        const text = event.data
        setMessages(prev => {
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
            // timestamp: timestamp,
          }]
        })
      }

      wsConnection.onerror = (event) => {
        // console.error('WebSocket error:', event)
        setError('Connection error occurred')
        setIsConnecting(false)
      }

      wsConnection.onclose = () => {
        setError('Connection closed')
        setIsConnecting(false)
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
  }, [timestamp])

  const handleSend = () => {
    if (!input.trim() || !ws || ws.readyState !== WebSocket.OPEN) {
      setError('Cannot send message: connection not available')
      return
    }

    setMessages(prev => [...prev, {
      id: prev.length + 1,
      text: input,
      isAi: false,
      // timestamp: timestamp,
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
    <div suppressHydrationWarning className="h-[calc(100vh-16rem)] overflow-y-auto">
      <div className="flex h-full flex-col">
        {error && (
          <div className="bg-red-500/10 text-red-400 px-4 py-2 text-sm">
            {error}
          </div>
        )}
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
              placeholder="有什么想问的?"
              className="flex-1"
              disabled={!ws || ws.readyState !== WebSocket.OPEN}
            />
            <Button 
              onClick={handleSend}
              disabled={!ws || ws.readyState !== WebSocket.OPEN}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              发送
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}