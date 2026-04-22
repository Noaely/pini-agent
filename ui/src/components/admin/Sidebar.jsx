const MENU = [
  {
    section: 'ראשי',
    items: [
      { id: 'dashboard',   icon: '📊', label: 'לוח בקרה' },
      { id: 'chat',        icon: '💬', label: 'צ׳אט' },
      { id: 'examples',    icon: '🗂️', label: 'דוגמאות צ׳אט' },
      { id: 'answers',     icon: '📝', label: 'תשובות לדוגמה' },
    ]
  },
  {
    section: 'נתונים',
    items: [
      { id: 'discounts',   icon: '🏷️', label: 'ניהול מבצעים' },
      { id: 'products',    icon: '🥩', label: 'ניהול מוצרים' },
    ]
  },
  {
    section: 'מערכת',
    items: [
      { id: 'settings',    icon: '⚙️', label: 'הגדרות' },
    ]
  },
]

export default function Sidebar({ activePage, onNavigate }) {
  return (
    <aside className="sidebar">
      {MENU.map(({ section, items }) => (
        <div key={section} className="sidebar-section">
          <div className="sidebar-section-title">{section}</div>
          {items.map(({ id, icon, label }) => (
            <button
              key={id}
              className={`sidebar-item${activePage === id ? ' active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              <span className="sidebar-item-icon">{icon}</span>
              {label}
            </button>
          ))}
        </div>
      ))}
    </aside>
  )
}
