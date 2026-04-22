import { useState, useEffect } from 'react'

export default function ChatInput({ onSend, disabled, injectedValue, onInjectedUsed }) {
  const [text, setText] = useState('')

  useEffect(() => {
    if (injectedValue) {
      setText(injectedValue)
      onInjectedUsed?.()
    }
  }, [injectedValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim() && !disabled) {
      onSend(text.trim())
      setText('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form className="chat-input-container" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input"
        placeholder="הקלידו הודעה..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label="הקלידו הודעה"
      />
      <button
        type="submit"
        className="btn-send"
        disabled={!text.trim() || disabled}
        aria-label="שלח"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
        </svg>
      </button>
    </form>
  )
}
