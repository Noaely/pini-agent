import { useState, useEffect } from 'react'
import iconHistory from '../../icons/history.png'

const DEMO_ORDERS = [
  { name: 'אפרת מוסה', phone: '972521000017', date: '2026-04-23T09:45:00Z', deliveryType: 'delivery', amount: 520 },
  { name: 'ניר ברוך',  phone: '972521000016', date: '2026-04-21T09:40:00Z', deliveryType: 'pickup',   amount: 310 },
  { name: 'שרה אלון',  phone: '972521000015', date: '2026-04-20T10:50:00Z', deliveryType: 'delivery', amount: 680 },
  { name: 'עמיר נחום', phone: '972521000014', date: '2026-04-18T09:45:00Z', deliveryType: 'pickup',   amount: 450 },
  { name: 'דינה כץ',   phone: '972521000013', date: '2026-04-17T10:40:00Z', deliveryType: 'delivery', amount: 730 },
  { name: 'יוסי הלוי', phone: '972521000012', date: '2026-04-16T09:55:00Z', deliveryType: 'pickup',   amount: 290 },
  { name: 'רחל גרין',  phone: '972521000011', date: '2026-04-14T11:20:00Z', deliveryType: 'delivery', amount: 610 },
  { name: 'משה לוי',   phone: '972521000010', date: '2026-04-13T08:30:00Z', deliveryType: 'pickup',   amount: 390 },
]

const DELIVERY_FILTERS = [
  { key: 'הכל',   value: null },
  { key: 'נשלחה', value: 'delivery' },
  { key: 'נאספה', value: 'pickup' },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('he-IL', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function DeliveryBadge({ type }) {
  if (type === 'delivery')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#3b82f6]/10 text-[#1d4ed8]">
        <span className="w-2 h-2 rounded-full bg-[#3b82f6]" />נשלחה
      </span>
    )
  if (type === 'pickup')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#16a34a]/10 text-[#16a34a]">
        <span className="w-2 h-2 rounded-full bg-[#16a34a]" />נאספה
      </span>
    )
  return <span className="text-[#5a6678] text-sm">—</span>
}

export default function OrderHistory() {
  const [orders, setOrders]           = useState(DEMO_ORDERS)
  const [loading, setLoading]         = useState(true)
  const [activeFilter, setActiveFilter] = useState('הכל')

  useEffect(() => {
    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => { if (data.orders?.length) setOrders(data.orders) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const activeValue = DELIVERY_FILTERS.find(f => f.key === activeFilter)?.value
  const filtered = activeValue == null ? orders : orders.filter(o => o.deliveryType === activeValue)

  const totalRevenue     = filtered.reduce((s, o) => s + (o.amount || 0), 0)
  const uniqueCustomers  = new Set(filtered.filter(o => o.phone).map(o => o.phone)).size

  return (
    <>
      <div>
        <h1 className="admin-page-title">היסטוריית הזמנות</h1>
        <p className="admin-page-subtitle">כל ההזמנות שנסגרו דרך הצ׳אט</p>
      </div>

      <div className="bg-[#e8f3ff] border border-[#e2e7ee] rounded-2xl p-6 shadow-[0_4px_24px_rgba(29,78,216,0.08)]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <img src={iconHistory} alt="" className="w-8 h-8 object-contain" />
          <h3 className="text-[#0d1b2e] text-lg font-semibold">כל ההזמנות</h3>
          <span className="mr-auto text-[#5a6678] text-sm">{filtered.length} מתוך {orders.length}</span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-5">
          {DELIVERY_FILTERS.map(({ key }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === key
                  ? 'bg-[#1d4ed8] text-white'
                  : 'bg-[#d6ebff] text-[#5a6678] hover:bg-[#bfdbfe] hover:text-[#0d1b2e]'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><span className="spinner" /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="border-b border-[#e2e7ee]">
                    <th className="pb-3 text-[#5a6678] font-medium text-sm">שם לקוח</th>
                    <th className="pb-3 text-[#5a6678] font-medium text-sm">טלפון</th>
                    <th className="pb-3 text-[#5a6678] font-medium text-sm">תאריך הזמנה</th>
                    <th className="pb-3 text-[#5a6678] font-medium text-sm">אופן קבלה</th>
                    <th className="pb-3 text-[#5a6678] font-medium text-sm">סכום</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, idx) => (
                    <tr key={idx} className="border-b border-[#e2e7ee] hover:bg-[#d6ebff] transition-all">
                      <td className="py-3 text-[#0d1b2e]">{order.name}</td>
                      <td className="py-3 text-[#5a6678]">{order.phone || '—'}</td>
                      <td className="py-3 text-[#5a6678] text-sm">{formatDate(order.date)}</td>
                      <td className="py-3"><DeliveryBadge type={order.deliveryType} /></td>
                      <td className="py-3 text-[#0d1b2e] font-medium">₪{order.amount.toLocaleString('he-IL')}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#5a6678]">אין הזמנות בסינון זה</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filtered.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#e2e7ee] flex justify-between items-end">
                <div className="flex gap-10">
                  <div>
                    <p className="text-[#5a6678] text-sm mb-1">לקוחות שביצעו הזמנה</p>
                    <p className="text-[#0d1b2e] text-2xl font-bold">{uniqueCustomers}</p>
                  </div>
                  <div>
                    <p className="text-[#5a6678] text-sm mb-1">סה״כ הזמנות</p>
                    <p className="text-[#0d1b2e] text-2xl font-bold">{filtered.length}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[#5a6678] text-sm mb-1">סה״כ הכנסות</p>
                  <p className="text-[#16a34a] text-3xl font-bold">₪{totalRevenue.toLocaleString('he-IL')}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
