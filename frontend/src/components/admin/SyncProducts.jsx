import { useState, useEffect, useCallback } from 'react'
import Toast from './shared/Toast'

export default function SyncProducts() {
  const [status, setStatus] = useState('idle')
  const [lastSync, setLastSync] = useState(null)
  const [toast, setToast] = useState(null)

  const loadStatus = useCallback(async () => {
    const r = await fetch('/api/admin/sync/status')
    const data = await r.json()
    setStatus(data.status || 'idle')
    setLastSync(data.lastSync || null)
  }, [])

  useEffect(() => { loadStatus() }, [loadStatus])

  useEffect(() => {
    if (status !== 'running') return
    const interval = setInterval(loadStatus, 2000)
    return () => clearInterval(interval)
  }, [status, loadStatus])

  async function runSync() {
    setStatus('running')
    try {
      const r = await fetch('/api/admin/sync', { method: 'POST' })
      if (!r.ok) throw new Error()
      setToast({ message: 'הסנכרון הופעל בהצלחה', type: 'success' })
      setTimeout(loadStatus, 1500)
    } catch {
      setStatus('error')
      setToast({ message: 'שגיאה בהפעלת הסנכרון', type: 'error' })
    }
  }

  const statusLabel = {
    idle:    { text: 'מעודכן',    dot: 'idle',    badge: 'badge-success' },
    running: { text: 'מסנכרן...', dot: 'running', badge: 'badge-primary' },
    error:   { text: 'שגיאה',     dot: 'error',   badge: 'badge-danger' },
  }[status] ?? { text: 'לא ידוע', dot: 'idle', badge: 'badge-gray' }

  return (
    <>
      <h1 className="admin-page-title">סנכרון מוצרים</h1>
      <p className="admin-page-subtitle">עדכון קטלוג המוצרים והמבצעים ממאטאון</p>

      <div className="card mb-4 max-w-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-lg bg-primary-bg flex items-center justify-center text-3xl flex-shrink-0">
            🔄
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-0.5">סנכרון נתונים מהאתר</h2>
            <p className="text-sm text-t2">מושך מחירים עדכניים ומבצעים ממאטאון</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className={`sync-status-dot ${statusLabel.dot}`} />
            <span className={`badge ${statusLabel.badge}`}>{statusLabel.text}</span>
          </div>
          {lastSync && (
            <span className="text-xs text-t2">
              סנכרון אחרון: {new Date(lastSync).toLocaleString('he-IL')}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary justify-center gap-2 py-3 px-8 text-base"
          onClick={runSync}
          disabled={status === 'running'}
        >
          {status === 'running' ? (
            <><span className="spinner" />מסנכרן...</>
          ) : (
            <>🔄 סנכרן עכשיו</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-xl mb-8">
        {[
          { icon: '🥩', title: 'תפריט מוצרים',   desc: 'scrape_json.py – כל הקטגוריות והמחירים' },
          { icon: '🏷️', title: 'מבצעים פעילים', desc: 'scrape_discounts.py – כל ההנחות הפעילות' },
        ].map(item => (
          <div key={item.title} className="card flex gap-2 items-start">
            <span className="text-2xl">{item.icon}</span>
            <div>
              <div className="font-semibold text-sm mb-0.5">{item.title}</div>
              <div className="text-xs text-t2">{item.desc}</div>
            </div>
          </div>
        ))}
      </div>


      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
