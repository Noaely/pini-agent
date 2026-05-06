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
import LandingPage from './LandingPage'

const PAGES = {
  dashboard: Dashboard,
  chat:      ChatPage,
  answers:   CustomAnswers,
  customers: CustomerList,
  orders:    OrderHistory,
  discounts: DiscountManager,
  products:  ProductManager,
  settings:  Settings,
  landing:   LandingPage,
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

  const contentClass = activePage === 'chat'
    ? 'admin-content chat-mode'
    : activePage === 'landing'
      ? 'admin-content landing-mode'
      : 'admin-content'

  return (
    <div className="admin-layout">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className={contentClass}>
        <Page {...pageProps} />
      </div>
    </div>
  )
}
