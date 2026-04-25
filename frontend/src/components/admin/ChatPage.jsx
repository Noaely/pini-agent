import ChatPanel from '../ChatPanel'
import { useChat } from '../../hooks/useChat'

export default function ChatPage({ injectedPrompt, onInjectedPromptUsed }) {
  const { messages, sendMessage, isLoading } = useChat()

  return (
    <div className="h-full flex flex-col">
      <ChatPanel
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
        injectedPrompt={injectedPrompt}
        onInjectedPromptUsed={onInjectedPromptUsed}
      />
    </div>
  )
}
