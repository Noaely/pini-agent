import { useState, useEffect, useRef, useCallback } from 'react'
import Toast from './shared/Toast'

function formatPhone(phone) {
  const str = String(phone)
  if (str.startsWith('972') && str.length >= 11) {
    return `+972-${str.slice(3, 5)}-${str.slice(5, 8)}-${str.slice(8)}`
  }
  return `+${str}`
}

export default function Settings() {
  const [status, setStatus]               = useState(null)
  const [phone, setPhone]                 = useState(null)
  const [qr, setQr]                       = useState(null)
  const [qrLoading, setQrLoading]         = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [toast, setToast]                 = useState(null)
  const qrRefreshRef                      = useRef(null)

  const [syncStatus, setSyncStatus] = useState('idle')
  const [syncLog, setSyncLog]       = useState([])
  const [lastSync, setLastSync]     = useState(null)

  // ── Sync ─────────────────────────────────────────────────────────
  const loadSyncStatus = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/sync/status')
      const data = await r.json()
      setSyncStatus(data.status || 'idle')
      setSyncLog(data.log || [])
      setLastSync(data.lastSync || null)
    } catch { /* ignore */ }
  }, [])

  useEffect(() => { loadSyncStatus() }, [loadSyncStatus])

  useEffect(() => {
    if (syncStatus !== 'running') return
    const id = setInterval(loadSyncStatus, 2000)
    return () => clearInterval(id)
  }, [syncStatus, loadSyncStatus])

  async function runSync() {
    setSyncStatus('running')
    try {
      const r = await fetch('/api/admin/sync', { method: 'POST' })
      if (!r.ok) throw new Error()
      setToast({ message: 'הסנכרון הופעל בהצלחה', type: 'success' })
      setTimeout(loadSyncStatus, 1500)
    } catch {
      setSyncStatus('error')
      setToast({ message: 'שגיאה בהפעלת הסנכרון', type: 'error' })
    }
  }

  const syncCfg = {
    idle:    { text: 'מעודכן',    dot: 'idle',    badge: 'badge-success' },
    running: { text: 'מסנכרן...', dot: 'running', badge: 'badge-primary' },
    error:   { text: 'שגיאה',     dot: 'error',   badge: 'badge-danger'  },
  }[syncStatus] ?? { text: 'לא ידוע', dot: 'idle', badge: 'badge-gray' }

  // ── WhatsApp status polling ───────────────────────────────────────
  const fetchStatus = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/whatsapp/status')
      const data = await r.json()
      setStatus(data.stateInstance)
      if (data.phone) setPhone(data.phone)
      if (data.stateInstance === 'authorized') {
        setQr(null)
        clearInterval(qrRefreshRef.current)
      }
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    const id = setInterval(fetchStatus, 5000)
    return () => { clearInterval(id); clearInterval(qrRefreshRef.current) }
  }, [fetchStatus])

  // ── QR fetch ─────────────────────────────────────────────────────
  const fetchQR = useCallback(async () => {
    setQrLoading(true)
    try {
      const r = await fetch('/api/admin/whatsapp/qr')
      const data = await r.json()
      if (data.type === 'qrCode') {
        setQr(data.message)
      } else if (data.type === 'alreadyLogged') {
        setQr(null)
        fetchStatus()
        setToast({ message: 'המספר כבר מחובר', type: 'success' })
      } else {
        setToast({ message: 'לא ניתן לקבל QR כרגע, נסה שוב', type: 'error' })
      }
    } catch {
      setToast({ message: 'שגיאה בתקשורת עם Green API', type: 'error' })
    }
    setQrLoading(false)
  }, [fetchStatus])

  async function handleGetQR() {
    await fetchQR()
    clearInterval(qrRefreshRef.current)
    qrRefreshRef.current = setInterval(fetchQR, 25000)
  }

  // ── Logout ───────────────────────────────────────────────────────
  async function handleLogout() {
    if (!window.confirm('להתנתק מהמספר הנוכחי?')) return
    setLogoutLoading(true)
    try {
      await fetch('/api/admin/whatsapp/logout', { method: 'POST' })
      setStatus('notAuthorized')
      setPhone(null)
      setQr(null)
      clearInterval(qrRefreshRef.current)
      setToast({ message: 'התנתקת בהצלחה', type: 'success' })
    } catch {
      setToast({ message: 'שגיאה בהתנתקות', type: 'error' })
    }
    setLogoutLoading(false)
  }

  const isConnected = status === 'authorized'

  const statusCfg = {
    authorized:    { label: 'מחובר',    dot: 'bg-green-500',  badge: 'badge-success' },
    notAuthorized: { label: 'לא מחובר', dot: 'bg-red-400',    badge: 'badge-danger'  },
    sleeping:      { label: 'ממתין',     dot: 'bg-yellow-400', badge: 'badge-primary' },
    error:         { label: 'שגיאה',     dot: 'bg-red-400',    badge: 'badge-danger'  },
  }[status] ?? { label: 'בודק...', dot: 'bg-gray-300', badge: 'badge-gray' }

  return (
    <>
      <h1 className="admin-page-title">הגדרות</h1>
      <p className="admin-page-subtitle">ניהול חיבורים ותצורת המערכת</p>

      <div className="grid grid-cols-2 gap-6 items-start">

      {/* ── WhatsApp ─────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center text-3xl flex-shrink-0">
            📱
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-0.5">חיבור WhatsApp</h2>
            <p className="text-sm text-t2">ניהול המספר המחובר דרך Green API</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-surface border border-border">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusCfg.dot}`} />
          <span className="text-sm font-medium">סטטוס:</span>
          <span className={`badge ${statusCfg.badge}`}>{statusCfg.label}</span>
        </div>

        {isConnected && phone && (
          <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg bg-green-50 border border-green-200 text-sm">
            <span className="text-green-600">📞</span>
            <span className="text-green-800 font-medium">מספר מחובר:</span>
            <span className="text-green-700 font-mono">{formatPhone(phone)}</span>
          </div>
        )}

        <div className="flex gap-3 flex-wrap mb-6">
          {!isConnected && (
            <button
              className="btn btn-primary gap-2"
              onClick={handleGetQR}
              disabled={qrLoading}
            >
              {qrLoading ? <><span className="spinner" />טוען QR...</> : '📲 התחבר עם QR'}
            </button>
          )}

          {qr && !isConnected && (
            <button className="btn btn-secondary gap-2" onClick={handleGetQR} disabled={qrLoading}>
              🔄 רענן QR
            </button>
          )}

          {isConnected && (
            <button
              className="btn btn-danger gap-2"
              onClick={handleLogout}
              disabled={logoutLoading}
            >
              {logoutLoading ? <><span className="spinner" />מתנתק...</> : '🔌 התנתק'}
            </button>
          )}
        </div>

        {qr && !isConnected && (
          <div className="border border-border rounded-xl p-5 flex flex-col items-center gap-3 bg-gray-50">
            <p className="text-sm font-medium text-t2">סרוק עם WhatsApp כדי להתחבר:</p>
            <img
              src={`data:image/png;base64,${qr}`}
              alt="QR Code"
              className="w-52 h-52 rounded-lg"
            />
            <p className="text-xs text-t2">הקוד מתרענן אוטומטית כל 25 שניות</p>
          </div>
        )}
      </div>

      {/* ── Sync ─────────────────────────────────────────────────── */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-lg bg-primary-bg flex items-center justify-center text-3xl flex-shrink-0">
            🔄
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-0.5">סנכרון מוצרים</h2>
            <p className="text-sm text-t2">עדכון קטלוג המוצרים והמבצעים מיטאון</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className={`sync-status-dot ${syncCfg.dot}`} />
            <span className={`badge ${syncCfg.badge}`}>{syncCfg.text}</span>
          </div>
          {lastSync && (
            <span className="text-xs text-t2">
              סנכרון אחרון: {new Date(lastSync).toLocaleString('he-IL')}
            </span>
          )}
        </div>

        <button
          className="btn btn-primary gap-2 py-3 px-8 text-base"
          onClick={runSync}
          disabled={syncStatus === 'running'}
        >
          {syncStatus === 'running' ? <><span className="spinner" />מסנכרן...</> : <>🔄 סנכרן עכשיו</>}
        </button>

        {syncLog.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-sm mb-3">היסטוריית סנכרון</h3>
            <table className="data-table">
              <thead>
                <tr>
                  <th>תאריך ושעה</th>
                  <th>סטטוס</th>
                  <th>פרטים</th>
                </tr>
              </thead>
              <tbody>
                {syncLog.slice().reverse().slice(0, 10).map((entry, i) => (
                  <tr key={i}>
                    <td className="text-t2 text-xs">{new Date(entry.timestamp).toLocaleString('he-IL')}</td>
                    <td>
                      <span className={`badge ${entry.status === 'success' ? 'badge-success' : 'badge-danger'}`}>
                        {entry.status === 'success' ? '✓ הצלחה' : '✕ שגיאה'}
                      </span>
                    </td>
                    <td className="text-xs text-t2">{entry.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      </div>{/* end grid */}

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
