// src/components/Chat.tsx
import React, { useEffect, useState } from 'react';
import { createChatConnection, sendMessage } from '@/api/chat';

interface Message {
  text: string;
  isAI: boolean;
}

const Chat: React.FC = () => {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    const wsConnection = createChatConnection();
    
    wsConnection.onmessage = (event: MessageEvent) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        text: message.text,
        isAI: true
      }]);
    };

    setWs(wsConnection);

    return () => {
      wsConnection?.close();
    };
  }, []);

  const handleSendMessage = (): void => {
    if (!inputMessage.trim() || !ws) return;

    setMessages(prev => [...prev, {
      text: inputMessage,
      isAI: false
    }]);

    sendMessage(ws, inputMessage);
    setInputMessage('');
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div 
            key={index}
            className={`mb-4 ${message.isAI ? 'text-left' : 'text-right'}`}
          >
            <div className={`
              inline-block p-3 rounded-lg
              ${message.isAI ? 'bg-gray-200' : 'bg-blue-500 text-white'}
            `}>
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
              setInputMessage(e.target.value)
            }
            onKeyPress={(e: React.KeyboardEvent) => 
              e.key === 'Enter' && handleSendMessage()
            }
            className="flex-1 p-2 border rounded"
            placeholder="输入消息..."
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            发送
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;