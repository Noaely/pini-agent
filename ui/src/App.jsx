import Header from './components/Header'
import ChatPanel from './components/ChatPanel'
import { useChat } from './hooks/useChat'
import './App.css'

export default function App() {
  const { messages, sendMessage, isLoading } = useChat()

  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <ChatPanel
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}
