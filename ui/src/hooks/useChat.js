import { useState, useCallback } from 'react'

const DEMO_MODE = false// שנה ל-false כשמפתח ה-API מוגדר

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
      let content

      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 800))
        content = `(מצב הדגמה) קיבלתי: "${text}" – הצ׳אט יענה תשובות אמיתיות לאחר הגדרת ANTHROPIC_API_KEY.`
      } else {
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
        if (!response.ok) throw new Error('API request failed')
        const data = await response.json()
        content = data.content
      }

      setMessages(prev => [...prev, {
        content,
        sender: 'agent',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      }])
    } catch (error) {
      console.error('Chat error:', error)
      setMessages(prev => [...prev, {
        content: 'מצטער, יש בעיה טכנית. אנא נסו שוב מאוחר יותר.',
        sender: 'agent',
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      }])
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  return { messages, sendMessage, isLoading }
}
