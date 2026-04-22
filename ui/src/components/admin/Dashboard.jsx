import { useState, useEffect } from 'react'

const MONTHS_HE = ['ינו׳', 'פבר׳', 'מרץ', 'אפר׳', 'מאי', 'יוני', 'יולי', 'אוג׳', 'ספט׳', 'אוק׳', 'נוב׳', 'דצמ׳']

function BarChart({ data }) {
  const maxVal = Math.max(...data.flatMap(d => [d.conversations, d.orders])) || 1
  const barW = 14
  const gap = 4
  const groupW = barW * 2 + gap + 16
  const height = 160
  const svgW = data.length * groupW

  return (
    <svg width="100%" viewBox={`0 0 ${svgW} ${height + 30}`} className="overflow-visible">
      {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
        const y = height - frac * height
        return (
          <g key={frac}>
            <line x1="0" y1={y} x2={svgW} y2={y} stroke="var(--color-border)" strokeWidth="1" strokeDasharray="4,4" />
            <text x="-4" y={y + 4} textAnchor="end" fontSize="10" fill="var(--color-text-secondary)">
              {Math.round(frac * maxVal)}
            </text>
          </g>
        )
      })}
      {data.map((d, i) => {
        const x = i * groupW + 8
        const h1 = (d.conversations / maxVal) * height
        const h2 = (d.orders / maxVal) * height
        return (
          <g key={i}>
            <rect x={x} y={height - h1} width={barW} height={h1} rx="4" fill="var(--color-primary)" opacity="0.85" />
            <rect x={x + barW + gap} y={height - h2} width={barW} height={h2} rx="4" fill="var(--color-success)" opacity="0.85" />
            <text x={x + barW} y={height + 18} textAnchor="middle" fontSize="10" fill="var(--color-text-secondary)">{d.month}</text>
          </g>
        )
      })}
    </svg>
  )
}

function LineChart({ data }) {
  if (!data.length) return null
  const maxVal = Math.max(...data.map(d => d.revenue)) || 1
  const w = 100
  const h = 120
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1 || 1)) * w
    const y = h - (d.revenue / maxVal) * h
    return `${x},${y}`
  })
  const pathD = `M ${pts.join(' L ')}`
  const areaD = `M ${pts[0]} L ${pts.join(' L ')} L ${(data.length - 1) * (w / (data.length - 1 || 1))},${h} L 0,${h} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${w} ${h + 20}`} preserveAspectRatio="none" className="h-[150px]">
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#lineGrad)" />
      <path d={pathD} fill="none" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {data.map((d, i) => {
        const x = (i / (data.length - 1 || 1)) * w
        const y = h - (d.revenue / maxVal) * h
        return <circle key={i} cx={x} cy={y} r="3" fill="var(--color-primary)" />
      })}
    </svg>
  )
}

function DonutChart({ slices }) {
  const total = slices.reduce((s, sl) => s + sl.value, 0) || 1
  let angle = -90
  const r = 40
  const cx = 60
  const cy = 60

  const arcs = slices.map(sl => {
    const sweep = (sl.value / total) * 360
    const start = angle
    angle += sweep
    return { ...sl, start, sweep }
  })

  function polarToCartesian(cx, cy, r, deg) {
    const rad = (deg * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
  }

  function arcPath(cx, cy, r, startDeg, sweepDeg) {
    if (sweepDeg >= 360) sweepDeg = 359.99
    const start = polarToCartesian(cx, cy, r, startDeg)
    const end = polarToCartesian(cx, cy, r, startDeg + sweepDeg)
    const large = sweepDeg > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
  }

  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {arcs.map((sl, i) => (
        <path
          key={i}
          d={arcPath(cx, cy, r, sl.start, sl.sweep)}
          fill="none"
          stroke={sl.color}
          strokeWidth="18"
          strokeLinecap="butt"
        />
      ))}
      <circle cx={cx} cy={cy} r="28" fill="var(--color-surface)" />
    </svg>
  )
}

export default function Dashboard() {
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(r => r.json())
      .then(setAnalytics)
      .catch(() => setAnalytics({ kpi: { conversations: 0, orders: 0, revenue: 0, rate: 0 }, monthly: [], revenueByMonth: [] }))
  }, [])

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-[300px]">
        <div className="spinner w-8 h-8" style={{ border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)' }} />
      </div>
    )
  }

  const { kpi, monthly, revenueByMonth } = analytics
  const convRate = kpi.conversations > 0 ? Math.round((kpi.orders / kpi.conversations) * 100) : 0

  const donutSlices = [
    { label: 'בקר', value: 45, color: '#6C5CE7' },
    { label: 'עוף', value: 25, color: '#A29BFE' },
    { label: 'כבש', value: 20, color: '#00B894' },
    { label: 'אחר', value: 10, color: '#FDCB6E' },
  ]

  return (
    <>
      <div>
        <h1 className="admin-page-title">לוח בקרה</h1>
        <p className="admin-page-subtitle">סיכום פעילות הצ׳אט ומכירות</p>
      </div>

      {/* KPI Cards */}
      <div className="stat-cards-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">שיחות שהתחילו</span>
            <div className="stat-card-icon">💬</div>
          </div>
          <div className="stat-card-value">{kpi.conversations}</div>
          <span className="stat-card-badge up">↑ +12% מחודש שעבר</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">הזמנות שנסגרו</span>
            <div className="stat-card-icon">✅</div>
          </div>
          <div className="stat-card-value">{kpi.orders}</div>
          <span className="stat-card-badge up">↑ +8% מחודש שעבר</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">הכנסות מהצ׳אט</span>
            <div className="stat-card-icon">💰</div>
          </div>
          <div className="stat-card-value">₪{kpi.revenue.toLocaleString('he-IL')}</div>
          <span className="stat-card-badge up">↑ +6.3% מחודש שעבר</span>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <span className="stat-card-label">שיעור המרה</span>
            <div className="stat-card-icon">📈</div>
          </div>
          <div className="stat-card-value">{convRate}%</div>
          <span className={`stat-card-badge ${convRate >= 30 ? 'up' : 'down'}`}>
            {convRate >= 30 ? '↑' : '↓'} {convRate >= 30 ? 'מעל הממוצע' : 'מתחת לממוצע'}
          </span>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Bar chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <span className="chart-card-title">פעילות שיחות</span>
            <div className="chart-legend">
              <div className="chart-legend-item">
                <div className="chart-legend-dot" style={{ background: 'var(--color-primary)' }} />
                שיחות
              </div>
              <div className="chart-legend-item">
                <div className="chart-legend-dot" style={{ background: 'var(--color-success)' }} />
                הזמנות
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <BarChart data={monthly.length ? monthly : getDefaultMonthly()} />
          </div>
        </div>

        {/* Donut chart */}
        <div className="chart-card">
          <div className="chart-card-header">
            <span className="chart-card-title">פילוח מכירות</span>
          </div>
          <div className="flex flex-col items-center">
            <DonutChart slices={donutSlices} />
            <div className="donut-legend w-full">
              {donutSlices.map(sl => (
                <div key={sl.label} className="donut-legend-item">
                  <div className="donut-legend-label">
                    <div className="donut-legend-color" style={{ background: sl.color }} />
                    {sl.label}
                  </div>
                  <div className="donut-legend-value">{sl.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue line chart */}
      <div className="chart-card">
        <div className="chart-card-header">
          <span className="chart-card-title">הכנסות לאורך זמן (₪)</span>
        </div>
        <LineChart data={revenueByMonth.length ? revenueByMonth : getDefaultRevenue()} />
      </div>
    </>
  )
}

function getDefaultMonthly() {
  return MONTHS_HE.slice(0, 7).map((month, i) => ({
    month,
    conversations: [2, 2, 3, 2, 3, 2, 2][i],
    orders: [1, 2, 1, 1, 1, 1, 1][i],
  }))
}

function getDefaultRevenue() {
  return MONTHS_HE.slice(0, 7).map((month, i) => ({
    month,
    revenue: [320, 740, 780, 0, 1450, 620, 450][i],
  }))
}
