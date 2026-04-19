import { useState, useCallback } from 'react'

const INITIAL_MESSAGE = {
  content: 'שלום! ברוכים הבאים לפנחס הקצב. במה אוכל לעזור לכם היום?',
  sender: 'agent',
  time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
}

export function useChat() {
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = useCallback(async (text) => {
    const userMessage = {
      content: text,
      sender: 'user',
      time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.sender === 'agent' ? 'assistant' : 'user',
            content: m.content
          }))
        })
      })

      if (!response.ok) {
        throw new Error('API request failed')
      }

      const data = await response.json()

      const agentMessage = {
        content: data.content,
        sender: 'agent',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Chat error:', error)

      // Fallback response if API fails
      const fallbackMessage = {
        content: 'מצטער, יש בעיה טכנית. אנא נסו שוב מאוחר יותר.',
        sender: 'agent',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, fallbackMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  return { messages, sendMessage, isLoading }
}
