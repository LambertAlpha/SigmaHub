// src/api/chat.ts

// 定义消息类型
interface WebSocketMessage {
  text: string
  type?: 'user' | 'assistant'  // 区分消息类型
  timestamp?: number
}

// 使用后端提供的 WebSocket 地址
const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://0.0.0.0:34567/v1/streamChat'

export function createChatConnection(): WebSocket {
  const ws = new WebSocket(WS_URL)
  
  ws.onopen = () => {
    console.log('WebSocket connected')
  }

  ws.onerror = (error) => {
    console.error('WebSocket error:', error)
  }

  ws.onclose = () => {
    console.log('WebSocket connection closed')
  }

  return ws
}

export function sendMessage(ws: WebSocket, message: string) {
  if (ws.readyState === WebSocket.OPEN) {
    // 按照后端要求的格式发送消息
    const messageData = {
      text: message
    }
    ws.send(JSON.stringify(messageData))
  } else {
    console.error('WebSocket is not connected')
  }
}