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
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#06B6D4]/10 text-[#06B6D4]">
        <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />נשלחה
      </span>
    )
  if (type === 'pickup')
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#22C55E]/10 text-[#22C55E]">
        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />נאספה
      </span>
    )
  return <span className="text-[#9B9BBB] text-sm">—</span>
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

      <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-6 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <img src={iconHistory} alt="" className="w-8 h-8 object-contain" />
          <h3 className="text-white text-lg font-semibold">כל ההזמנות</h3>
          <span className="mr-auto text-[#9B9BBB] text-sm">{filtered.length} מתוך {orders.length}</span>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mb-5">
          {DELIVERY_FILTERS.map(({ key }) => (
            <button
              key={key}
              onClick={() => setActiveFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeFilter === key
                  ? 'bg-[#7C5CBF] text-white'
                  : 'bg-[#252246] text-[#9B9BBB] hover:bg-[#2D2B52] hover:text-white'
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
                  <tr className="border-b border-[#2D2B52]">
                    <th className="pb-3 text-[#9B9BBB] font-medium text-sm">שם לקוח</th>
                    <th className="pb-3 text-[#9B9BBB] font-medium text-sm">טלפון</th>
                    <th className="pb-3 text-[#9B9BBB] font-medium text-sm">תאריך הזמנה</th>
                    <th className="pb-3 text-[#9B9BBB] font-medium text-sm">אופן קבלה</th>
                    <th className="pb-3 text-[#9B9BBB] font-medium text-sm">סכום</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, idx) => (
                    <tr key={idx} className="border-b border-[#2D2B52] hover:bg-[#252246] transition-all">
                      <td className="py-3 text-white">{order.name}</td>
                      <td className="py-3 text-[#9B9BBB]">{order.phone || '—'}</td>
                      <td className="py-3 text-[#9B9BBB] text-sm">{formatDate(order.date)}</td>
                      <td className="py-3"><DeliveryBadge type={order.deliveryType} /></td>
                      <td className="py-3 text-white font-medium">₪{order.amount.toLocaleString('he-IL')}</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#9B9BBB]">אין הזמנות בסינון זה</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filtered.length > 0 && (
              <div className="mt-6 pt-5 border-t border-[#2D2B52] flex justify-between items-end">
                <div className="flex gap-10">
                  <div>
                    <p className="text-[#9B9BBB] text-sm mb-1">לקוחות שביצעו הזמנה</p>
                    <p className="text-white text-2xl font-bold">{uniqueCustomers}</p>
                  </div>
                  <div>
                    <p className="text-[#9B9BBB] text-sm mb-1">סה״כ הזמנות</p>
                    <p className="text-white text-2xl font-bold">{filtered.length}</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="text-[#9B9BBB] text-sm mb-1">סה״כ הכנסות</p>
                  <p className="text-[#22C55E] text-3xl font-bold">₪{totalRevenue.toLocaleString('he-IL')}</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
