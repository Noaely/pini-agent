import { useState, useEffect } from 'react'
import iconCustomers from '../../icons/customers-table.png'

const DEMO_CUSTOMERS = [
  { name: 'אפרת מוסה', phone: '972521000017', status: 'הזמנה נסגרה', lastActivity: '2026-04-23T09:45:00Z' },
  { name: 'לא זמין',   phone: '972521000051', status: 'מחכה לתשובה', lastActivity: '2026-04-23T14:00:00Z' },
  { name: 'לא זמין',   phone: '972521000067', status: 'הזמנה ננטשה', lastActivity: '2026-04-22T11:10:00Z' },
  { name: 'ניר ברוך',  phone: '972521000016', status: 'הזמנה נסגרה', lastActivity: '2026-04-21T09:40:00Z' },
  { name: 'שרה אלון',  phone: '972521000015', status: 'הזמנה נסגרה', lastActivity: '2026-04-20T10:50:00Z' },
  { name: 'לא זמין',   phone: '972521000066', status: 'הזמנה ננטשה', lastActivity: '2026-04-19T11:45:00Z' },
  { name: 'עמיר נחום', phone: '972521000014', status: 'הזמנה נסגרה', lastActivity: '2026-04-18T09:45:00Z' },
  { name: 'דינה כץ',   phone: '972521000013', status: 'הזמנה נסגרה', lastActivity: '2026-04-17T10:40:00Z' },
  { name: 'יוסי הלוי', phone: '972521000012', status: 'הזמנה נסגרה', lastActivity: '2026-04-16T09:55:00Z' },
  { name: 'לא זמין',   phone: '972521000065', status: 'הזמנה ננטשה', lastActivity: '2026-04-15T13:40:00Z' },
]

const STATUS_FILTERS = ['הכל', 'הזמנה נסגרה', 'מחכה לתשובה', 'הזמנה ננטשה', 'אין מענה']

const STATUS_STYLE = {
  'הזמנה נסגרה':  { bg: 'bg-[#16a34a]/10', text: 'text-[#16a34a]', dot: '#16a34a' },
  'מחכה לתשובה': { bg: 'bg-[#F59E0B]/10', text: 'text-[#b45309]', dot: '#F59E0B' },
  'הזמנה ננטשה':  { bg: 'bg-[#1d4ed8]/10', text: 'text-[#1d4ed8]', dot: '#1d4ed8' },
  'אין מענה':     { bg: 'bg-[#EF4444]/10', text: 'text-[#EF4444]', dot: '#EF4444' },
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function CustomerList() {
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS)
  const [loading, setLoading]     = useState(true)
  const [activeFilter, setActiveFilter] = useState('הכל')

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(data => { if (data.customerTable?.length) setCustomers(data.customerTable) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = activeFilter === 'הכל'
    ? customers
    : customers.filter(c => c.status === activeFilter)

  return (
    <>
      <div>
        <h1 className="admin-page-title">רשימת לקוחות</h1>
        <p className="admin-page-subtitle">כל הלקוחות שיצרו קשר דרך הצ׳אט</p>
      </div>

      <div className="bg-[#e8f3ff] border border-[#e2e7ee] rounded-2xl p-6 shadow-[0_4px_24px_rgba(29,78,216,0.08)]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <img src={iconCustomers} alt="" className="w-8 h-8 object-contain" />
          <h3 className="text-[#0d1b2e] text-lg font-semibold">כל הלקוחות</h3>
          <span className="mr-auto text-[#5a6678] text-sm">{filtered.length} מתוך {customers.length}</span>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-2 mb-5">
          {STATUS_FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === f
                  ? 'bg-[#1d4ed8] text-white'
                  : 'bg-[#d6ebff] text-[#5a6678] hover:bg-[#bfdbfe] hover:text-[#0d1b2e]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><span className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right">
              <thead>
                <tr className="border-b border-[#e2e7ee]">
                  <th className="pb-3 text-[#5a6678] font-medium text-sm">שם</th>
                  <th className="pb-3 text-[#5a6678] font-medium text-sm">מספר טלפון</th>
                  <th className="pb-3 text-[#5a6678] font-medium text-sm">פעילות אחרונה</th>
                  <th className="pb-3 text-[#5a6678] font-medium text-sm">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const s = STATUS_STYLE[c.status] ?? STATUS_STYLE['אין מענה']
                  return (
                    <tr key={idx} className="border-b border-[#e2e7ee] hover:bg-[#d6ebff] transition-all">
                      <td className="py-3 text-[#0d1b2e]">{c.name}</td>
                      <td className="py-3 text-[#5a6678]">{c.phone}</td>
                      <td className="py-3 text-[#5a6678] text-sm">{formatDate(c.lastActivity)}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs ${s.bg} ${s.text}`}>
                          <span className="w-2 h-2 rounded-full" style={{ background: s.dot }} />
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  )
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-[#5a6678]">אין לקוחות בסטטוס זה</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  )
}
