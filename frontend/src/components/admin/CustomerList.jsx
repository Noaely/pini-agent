import { useState, useEffect } from 'react'

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
  'הזמנה נסגרה':  { bg: 'bg-[#16a34a]/10', text: 'text-[#15803d]', dot: '#16a34a' },
  'מחכה לתשובה': { bg: 'bg-[#f59e0b]/10', text: 'text-[#b45309]', dot: '#f59e0b' },
  'הזמנה ננטשה':  { bg: 'bg-[#e11d48]/10', text: 'text-[#be123c]', dot: '#e11d48' },
  'אין מענה':     { bg: 'bg-[#64748b]/10', text: 'text-[#475569]', dot: '#64748b' },
}

const AVATAR_COLORS = ['#11a06a', '#0c9fb3', '#b8810b', '#6f7d86', '#c0506a', '#1d4ed8', '#7c3aed', '#d6336c']

function initials(name) {
  if (!name) return '–'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) return parts[0][0] + parts[1][0]
  return name.slice(0, 2)
}

function avatarColor(name) {
  let h = 0
  for (let i = 0; i < (name || '').length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0
  return AVATAR_COLORS[h % AVATAR_COLORS.length]
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
  const [search, setSearch]       = useState('')

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(data => { if (data.customerTable?.length) setCustomers(data.customerTable) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const q = search.trim()
  const filtered = customers.filter(c => {
    const matchF = activeFilter === 'הכל' || c.status === activeFilter
    const matchQ = !q || (c.name || '').includes(q) || (c.phone || '').includes(q)
    return matchF && matchQ
  })

  return (
    <>
      <div>
        <h1 className="admin-page-title">רשימת לקוחות</h1>
        <p className="admin-page-subtitle">כל הלקוחות שיצרו קשר דרך הצ׳אט</p>
      </div>

      <section className="bg-white border border-[#e2e7ee] rounded-2xl p-5 shadow-[0_4px_24px_rgba(29,78,216,0.06)]">
        {/* card head */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-9 h-9 rounded-xl bg-[#1d4ed8]/10 text-[#1d4ed8] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
          </span>
          <span className="text-[#0d1b2e] text-base font-bold">כל הלקוחות</span>
          <span className="mr-auto text-[#5a6678] text-sm">
            <b className="text-[#0d1b2e] font-bold">{filtered.length}</b> מתוך {customers.length}
          </span>
        </div>

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-[#f4f7fb] border border-[#e2e7ee] rounded-xl px-3 py-2 min-w-[240px] focus-within:border-[#1d4ed8] focus-within:bg-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-[#9eb3d4] flex-shrink-0"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חיפוש לפי שם או טלפון…"
              className="bg-transparent outline-none text-sm text-[#0d1b2e] flex-1 placeholder:text-[#9eb3d4]"
            />
          </div>
          <div className="flex-1" />
          <div className="flex flex-wrap gap-1.5">
            {STATUS_FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeFilter === f
                    ? 'bg-[#1d4ed8] text-white shadow-[0_2px_8px_rgba(29,78,216,0.25)]'
                    : 'bg-[#f4f7fb] text-[#5a6678] hover:bg-[#e8f0fc] hover:text-[#0d1b2e]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><span className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right border-collapse">
              <thead>
                <tr className="border-b border-[#e2e7ee]">
                  <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">שם</th>
                  <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">מספר טלפון</th>
                  <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">פעילות אחרונה</th>
                  <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">סטטוס</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const s = STATUS_STYLE[c.status] ?? STATUS_STYLE['אין מענה']
                  return (
                    <tr key={idx} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#f4f7fb] transition-colors">
                      <td className="py-3 px-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: avatarColor(c.name) }}>
                            {initials(c.name)}
                          </span>
                          <span className="text-[#0d1b2e] font-medium">{c.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-2 text-[#5a6678] text-sm tabular-nums">{c.phone}</td>
                      <td className="py-3 px-2 text-[#5a6678] text-sm tabular-nums">{formatDate(c.lastActivity)}</td>
                      <td className="py-3 px-2">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${s.bg} ${s.text}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
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

        <div className="mt-4 pt-3 border-t border-[#eef1f6] text-xs text-[#5a6678]">
          מוצגים {filtered.length} מתוך {customers.length} לקוחות
        </div>
      </section>
    </>
  )
}
