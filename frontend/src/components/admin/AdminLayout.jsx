import { useState } from 'react'
import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import CustomAnswers from './CustomAnswers'
import DiscountManager from './DiscountManager'
import ProductManager from './ProductManager'
import CustomerList from './CustomerList'
import OrderHistory from './OrderHistory'
import ChatPage from './ChatPage'
import Settings from './Settings'

const PAGES = {
  dashboard: Dashboard,
  chat:      ChatPage,
  answers:   CustomAnswers,
  customers: CustomerList,
  orders:    OrderHistory,
  discounts: DiscountManager,
  products:  ProductManager,
  settings:  Settings,
}

export default function AdminLayout() {
  const [activePage, setActivePage] = useState('dashboard')
  const [chatPrompt, setChatPrompt] = useState('')
  const Page = PAGES[activePage] ?? Dashboard

  function handleSwitchToChat(prompt = '') {
    setActivePage('chat')
    if (prompt) setChatPrompt(prompt)
  }

  const pageProps = activePage === 'chat'
    ? { injectedPrompt: chatPrompt, onInjectedPromptUsed: () => setChatPrompt('') }
    : { onSwitchToChat: handleSwitchToChat }

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className={`admin-content${activePage === 'chat' ? ' chat-mode' : ''}`}>
        <Page {...pageProps} />
      </div>
    </div>
  )
}
