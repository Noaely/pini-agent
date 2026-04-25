import { useState, useEffect } from 'react'
import { AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import iconMoney from '../../icons/money.png'
import iconConversion from '../../icons/conversion-rate.png'
import iconOrders from '../../icons/successful-orders.png'
import iconCustomers from '../../icons/customers.png'
import iconAbandoned from '../../icons/abandoned-orders.png'
import iconPieChart from '../../icons/pie-chart.png'
import iconCustomersTable from '../../icons/customers-table.png'
import iconHistory from '../../icons/history.png'

function Trend({ value, inverted = false }) {
  if (value == null) return null
  const isUp = value > 0
  const isGood = inverted ? !isUp : isUp
  return (
    <p className={`text-xs mt-1 ${isGood ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
      {isUp ? '↑' : '↓'} {Math.abs(value)}% {isUp ? 'יותר' : 'פחות'} מחודש שעבר
    </p>
  )
}

const PIE_GRADIENT_PAIRS = [
  ['#86EFAC', '#22C55E'],
  ['#C4B5FD', '#8B5CF6'],
  ['#FCA5A5', '#EF4444'],
  ['#FDE68A', '#F59E0B'],
  ['#67E8F9', '#06B6D4'],
  ['#F9A8D4', '#EC4899'],
]

function getDemoDashboardData() {
  return {
    kpi: { conversations: 71, orders: 21, revenue: 8340, conversionRate: 29.6, newCustomers: 59, abandoned: 8,
      trendConversionRate: 12.3, trendOrders: 18, trendNewCustomers: 24.5, trendAbandoned: -8.3 },
    revenueByDate: [
      { date: '25 מרץ', amount: 730 },
      { date: '28 מרץ', amount: 620 },
      { date: '1 אפר׳', amount: 570 },
      { date: '4 אפר׳', amount: 750 },
      { date: '7 אפר׳', amount: 860 },
      { date: '10 אפר׳', amount: 420 },
      { date: '13 אפר׳', amount: 1030 },
      { date: '16 אפר׳', amount: 1630 },
      { date: '19 אפר׳', amount: 1140 },
      { date: '22 אפר׳', amount: 590 },
    ],
    salesByCategory: [
      { name: 'בקר טרי', value: 4640 },
      { name: 'אנטריקוט', value: 2910 },
      { name: 'עוף', value: 2170 },
      { name: 'כבש', value: 2010 },
      { name: 'נקניקיות', value: 980 },
      { name: 'קבב', value: 730 },
    ],
    customerTable: [
      { name: 'אפרת מוסה', phone: '972521000017', status: 'הזמנה נסגרה', lastActivity: '2026-04-23T09:45:00Z' },
      { name: 'לא זמין', phone: '972521000051', status: 'מחכה לתשובה', lastActivity: '2026-04-23T14:00:00Z' },
      { name: 'לא זמין', phone: '972521000067', status: 'הזמנה ננטשה', lastActivity: '2026-04-22T11:10:00Z' },
      { name: 'ניר ברוך', phone: '972521000016', status: 'הזמנה נסגרה', lastActivity: '2026-04-21T09:40:00Z' },
      { name: 'שרה אלון', phone: '972521000015', status: 'הזמנה נסגרה', lastActivity: '2026-04-20T10:50:00Z' },
      { name: 'לא זמין', phone: '972521000066', status: 'הזמנה ננטשה', lastActivity: '2026-04-19T11:45:00Z' },
      { name: 'עמיר נחום', phone: '972521000014', status: 'הזמנה נסגרה', lastActivity: '2026-04-18T09:45:00Z' },
      { name: 'דינה כץ', phone: '972521000013', status: 'הזמנה נסגרה', lastActivity: '2026-04-17T10:40:00Z' },
      { name: 'יוסי הלוי', phone: '972521000012', status: 'הזמנה נסגרה', lastActivity: '2026-04-16T09:55:00Z' },
      { name: 'לא זמין', phone: '972521000065', status: 'הזמנה ננטשה', lastActivity: '2026-04-15T13:40:00Z' },
    ],
    monthly: [],
    revenueByMonth: [],
  }
}

const DEMO_ORDERS = [
  { name: 'אפרת מוסה', phone: '972521000017', date: '2026-04-23T09:45:00Z', deliveryType: 'delivery', amount: 520 },
  { name: 'ניר ברוך',  phone: '972521000016', date: '2026-04-21T09:40:00Z', deliveryType: 'pickup',   amount: 310 },
  { name: 'שרה אלון',  phone: '972521000015', date: '2026-04-20T10:50:00Z', deliveryType: 'delivery', amount: 680 },
  { name: 'עמיר נחום', phone: '972521000014', date: '2026-04-18T09:45:00Z', deliveryType: 'pickup',   amount: 450 },
  { name: 'דינה כץ',   phone: '972521000013', date: '2026-04-17T10:40:00Z', deliveryType: 'delivery', amount: 730 },
  { name: 'יוסי הלוי', phone: '972521000012', date: '2026-04-16T09:55:00Z', deliveryType: 'pickup',   amount: 290 },
]

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(getDemoDashboardData())
  const [orders, setOrders] = useState(DEMO_ORDERS)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(data => {
        setAnalytics(prev => ({
          ...data,
          kpi: {
            ...data.kpi,
            conversionRate:      data.kpi?.conversionRate      || prev.kpi.conversionRate,
            newCustomers:        data.kpi?.newCustomers        || prev.kpi.newCustomers,
            trendConversionRate: data.kpi?.trendConversionRate ?? prev.kpi.trendConversionRate,
            trendOrders:         data.kpi?.trendOrders         ?? prev.kpi.trendOrders,
            trendNewCustomers:   data.kpi?.trendNewCustomers   ?? prev.kpi.trendNewCustomers,
            trendAbandoned:      data.kpi?.trendAbandoned      ?? prev.kpi.trendAbandoned,
          },
          revenueByDate:   data.revenueByDate?.length   ? data.revenueByDate   : prev.revenueByDate,
          salesByCategory: data.salesByCategory?.length ? data.salesByCategory : prev.salesByCategory,
          customerTable:   data.customerTable?.length   ? data.customerTable   : prev.customerTable,
        }))
      })
      .catch(() => {})

    fetch('/api/admin/orders')
      .then(r => r.json())
      .then(data => { if (data.orders?.length) setOrders(data.orders) })
      .catch(() => {})
  }, [])

  const { kpi, revenueByDate, salesByCategory, customerTable } = analytics

  return (
    <>
      <div>
        <h1 className="admin-page-title">לוח בקרה</h1>
        <p className="admin-page-subtitle">סיכום פעילות הצ׳אט ומכירות</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-6">
        <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-5 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9B9BBB] text-sm">סה״כ הכנסות</span>
            <img src={iconMoney} alt="" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-4xl font-bold text-white text-center">₪{kpi.revenue.toLocaleString('he-IL')}</p>
          <p className="text-xs text-[#22C55E] mt-2 text-center">מכל הזמנות הצ׳אט</p>
        </div>

        <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-5 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9B9BBB] text-sm">שיעור המרה</span>
            <img src={iconConversion} alt="" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-4xl font-bold text-white text-center">{kpi.conversionRate ?? '88'}%</p>
          <div className="text-center"><Trend value={kpi.trendConversionRate} /></div>
        </div>

        <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-5 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9B9BBB] text-sm">הזמנות שנסגרו</span>
            <img src={iconOrders} alt="" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-4xl font-bold text-white text-center">{kpi.orders}</p>
          <div className="text-center"><Trend value={kpi.trendOrders} /></div>
        </div>

        <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-5 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9B9BBB] text-sm">לקוחות חדשים</span>
            <img src={iconCustomers} alt="" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-4xl font-bold text-white text-center">{kpi.newCustomers ?? '34'}</p>
          <div className="text-center"><Trend value={kpi.trendNewCustomers} /></div>
        </div>

        <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-5 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[#9B9BBB] text-sm">הזמנות שננטשו</span>
            <img src={iconAbandoned} alt="" className="w-10 h-10 object-contain" />
          </div>
          <p className="text-4xl font-bold text-white text-center">{kpi.abandoned ?? 10}</p>
          <div className="text-center"><Trend value={kpi.trendAbandoned} inverted /></div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue Area Chart */}
        <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-6 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-white text-lg font-semibold">הכנסות בחודש האחרון</h3>
            <div className="text-left">
              <p className="text-[#9B9BBB] text-xs mb-0.5">סה״כ החודש</p>
              <p className="text-white text-xl font-bold">
                ₪{revenueByDate.reduce((s, d) => s + (d.amount || 0), 0).toLocaleString('he-IL')}
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueByDate}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7C5CBF" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#00D4D4" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2B52" />
              <XAxis
                dataKey="date"
                tick={{ fill: '#9B9BBB', fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                tick={{ fill: '#9B9BBB', fontSize: 12 }}
                axisLine={false}
                tickFormatter={(value) => `₪${value}`}
              />
              <Tooltip
                contentStyle={{
                  background: '#252246',
                  border: '1px solid #2D2B52',
                  borderRadius: 12,
                  color: '#fff'
                }}
                formatter={(value) => [`₪${value}`, 'הכנסות']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#00D4D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorAmount)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Sales by Category Pie Chart */}
        <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-6 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
          <div className="flex items-center gap-2 mb-4">
            <img src={iconPieChart} alt="" className="w-8 h-8 object-contain" />
            <h3 className="text-white text-lg font-semibold">פילוח מכירות לפי קטגוריה</h3>
          </div>
          {(() => {
            const catTotal = salesByCategory.reduce((s, e) => s + e.value, 0)
            return (
              <div className="flex items-center gap-6">
                <div className="relative flex-shrink-0" style={{ width: '52%', height: 260 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <defs>
                        {PIE_GRADIENT_PAIRS.map(([from, to], i) => (
                          <linearGradient key={i} id={`pieGrad${i}`} x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%"   stopColor={from} stopOpacity={1} />
                            <stop offset="100%" stopColor={to}   stopOpacity={1} />
                          </linearGradient>
                        ))}
                      </defs>
                      <Pie
                        data={salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={98}
                        outerRadius={108}
                        dataKey="value"
                        stroke="#1A1835"
                        strokeWidth={3}
                      >
                        {salesByCategory.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={`url(#pieGrad${index % PIE_GRADIENT_PAIRS.length})`} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ background: '#252246', border: '1px solid #2D2B52', borderRadius: 12, color: '#fff' }}
                        formatter={(value) => [`₪${value.toLocaleString('he-IL')}`, 'סה״כ מכירות']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-[#9B9BBB] text-xs mb-0.5">סה״כ מכירות</p>
                    <p className="text-white text-2xl font-bold">₪{catTotal.toLocaleString('he-IL')}</p>
                  </div>
                </div>
                <div className="flex flex-col flex-1 divide-y divide-[#2D2B52]">
                  {salesByCategory.map((entry, index) => {
                    const pct = catTotal > 0 ? ((entry.value / catTotal) * 100).toFixed(0) : 0
                    const dotColor = PIE_GRADIENT_PAIRS[index % PIE_GRADIENT_PAIRS.length][1]
                    return (
                      <div key={index} className="flex items-center gap-2.5 py-2.5">
                        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: dotColor }} />
                        <span className="text-[#9B9BBB] text-sm flex-1">{entry.name}</span>
                        <span className="text-white text-sm font-semibold">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })()}
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-6 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
        <div className="flex items-center gap-2 mb-4">
          <img src={iconCustomersTable} alt="" className="w-10 h-10 object-contain" />
          <h3 className="text-white text-xl font-semibold">טבלת לקוחות</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#2D2B52]">
                <th className="pb-3 text-[#9B9BBB] font-medium text-sm">שם</th>
                <th className="pb-3 text-[#9B9BBB] font-medium text-sm">מספר טלפון</th>
                <th className="pb-3 text-[#9B9BBB] font-medium text-sm">סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {customerTable.map((customer, idx) => (
                <tr key={idx} className="border-b border-[#2D2B52] hover:bg-[#252246] transition-all">
                  <td className="py-3 text-white">{customer.name}</td>
                  <td className="py-3 text-[#9B9BBB]">{customer.phone}</td>
                  <td className="py-3">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs ${
                      customer.status === 'הזמנה נסגרה' ? 'bg-[#22C55E]/10 text-[#22C55E]' :
                      customer.status === 'מחכה לתשובה' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      customer.status === 'הזמנה ננטשה' ? 'bg-[#7C5CBF]/10 text-[#9B7EE8]' :
                      'bg-[#EF4444]/10 text-[#EF4444]'
                    }`}>
                      <span className="w-2 h-2 rounded-full" style={{
                        background: customer.status === 'הזמנה נסגרה' ? '#22C55E' :
                                  customer.status === 'מחכה לתשובה' ? '#F59E0B' :
                                  customer.status === 'הזמנה ננטשה' ? '#9B7EE8' : '#EF4444'
                      }} />
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#1A1835] border border-[#2D2B52] rounded-2xl p-6 shadow-[0_4px_24px_rgba(124,92,191,0.12)]">
        <div className="flex items-center gap-2 mb-4">
          <img src={iconHistory} alt="" className="w-10 h-10 object-contain" />
          <h3 className="text-white text-xl font-semibold">היסטוריית הזמנות</h3>
        </div>
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
              {orders.map((order, idx) => (
                <tr key={idx} className="border-b border-[#2D2B52] hover:bg-[#252246] transition-all">
                  <td className="py-3 text-white">{order.name}</td>
                  <td className="py-3 text-[#9B9BBB]">{order.phone || '—'}</td>
                  <td className="py-3 text-[#9B9BBB] text-sm">{formatDate(order.date)}</td>
                  <td className="py-3">
                    {order.deliveryType === 'delivery' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#06B6D4]/10 text-[#06B6D4]">
                        <span className="w-2 h-2 rounded-full bg-[#06B6D4]" />נשלחה
                      </span>
                    ) : order.deliveryType === 'pickup' ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs bg-[#22C55E]/10 text-[#22C55E]">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />נאספה
                      </span>
                    ) : <span className="text-[#9B9BBB]">—</span>}
                  </td>
                  <td className="py-3 text-white font-medium">₪{order.amount.toLocaleString('he-IL')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
