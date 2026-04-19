import { useEffect, useRef } from 'react'
import Message from './Message'
import ChatInput from './ChatInput'

export default function ChatPanel({ messages, onSendMessage, isLoading }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <section className="chat-panel">
      <div className="panel-header">
        <h2 className="panel-title">שיחה עם העוזר</h2>
      </div>

      <div className="chat-messages" aria-live="polite">
        {messages.map((message, index) => (
          <Message
            key={index}
            content={message.content}
            sender={message.sender}
            time={message.time}
          />
        ))}

        {isLoading && (
          <div className="message message-agent">
            <div className="typing-indicator">
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
              <span className="typing-dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </section>
  )
}
