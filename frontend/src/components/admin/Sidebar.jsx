import iconDashboard from '../../icons/dashboard.png'
import iconChat from '../../icons/chat.png'
import iconExamples from '../../icons/examples.png'
import iconDiscounts from '../../icons/discounts.png'
import iconProducts from '../../icons/products.png'
import iconCustomers from '../../icons/customers-table.png'
import iconHistory from '../../icons/history.png'

const MENU = [
  {
    section: 'ראשי',
    items: [
      { id: 'dashboard', icon: iconDashboard, label: 'לוח בקרה' },
      { id: 'chat',      icon: iconChat,      label: 'צ׳אט' },
      { id: 'answers',   icon: iconExamples,  label: 'תשובות לדוגמה' },
    ]
  },
  {
    section: 'נתונים',
    items: [
      { id: 'orders',    icon: iconHistory,   label: 'היסטוריית הזמנות' },
      { id: 'customers', icon: iconCustomers, label: 'רשימת לקוחות' },
      { id: 'discounts', icon: iconDiscounts, label: 'ניהול מבצעים' },
      { id: 'products',  icon: iconProducts,  label: 'ניהול מוצרים' },
    ]
  },
  {
    section: 'מערכת',
    items: [
      { id: 'landing',   icon: null, label: 'דף נחיתה' },
      { id: 'settings',  icon: null, label: 'הגדרות' },
    ]
  },
]

export default function Sidebar({ activePage, onNavigate }) {
  function handleClick(id) {
    if (id === 'landing') {
      window.open('/landing.html', '_blank')
      return
    }
    onNavigate(id)
  }

  return (
    <aside className="sidebar">
      {MENU.map(({ section, items }) => (
        <div key={section} className="sidebar-section">

          {items.map(({ id, icon, label }) => (
            <button
              key={id}
              className={`sidebar-item hover:scale-110 rounded-full${activePage === id ? ' active' : ''}`}
              onClick={() => handleClick(id)}
            >
              <span className="sidebar-item-icon">
                {icon
                  ? <img src={icon} alt="" className="w-8 h-8 object-contain" />
                  : id === 'landing' ? '🌐' : '⚙️'
                }
              </span>
              {label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  )
}
