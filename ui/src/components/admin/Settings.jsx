import { useState, useEffect, useRef, useCallback } from 'react'
import Toast from './shared/Toast'

export default function Settings() {
  const [status, setStatus]           = useState(null)
  const [qr, setQr]                   = useState(null)
  const [qrLoading, setQrLoading]     = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [toast, setToast]             = useState(null)
  const pollRef                       = useRef(null)

  const [syncStatus, setSyncStatus]   = useState('idle')
  const [syncLog, setSyncLog]         = useState([])
  const [lastSync, setLastSync]       = useState(null)

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
    const interval = setInterval(loadSyncStatus, 2000)
    return () => clearInterval(interval)
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

  const syncStatusConfig = {
    idle:    { text: 'מעודכן',    dot: 'idle',    badge: 'badge-success' },
    running: { text: 'מסנכרן...', dot: 'running', badge: 'badge-primary' },
    error:   { text: 'שגיאה',     dot: 'error',   badge: 'badge-danger'  },
  }[syncStatus] ?? { text: 'לא ידוע', dot: 'idle', badge: 'badge-gray' }

  const fetchStatus = useCallback(async () => {
    try {
      const r = await fetch('/api/admin/whatsapp/status')
      const data = await r.json()
      setStatus(data.stateInstance)
      if (data.stateInstance === 'authorized') {
        setQr(null)
        clearInterval(pollRef.current)
      }
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    fetchStatus()
    const interval = setInterval(fetchStatus, 5000)
    return () => { clearInterval(interval); clearInterval(pollRef.current) }
  }, [fetchStatus])

  async function waitForInstance(maxWait = 20000) {
    const start = Date.now()
    while (Date.now() - start < maxWait) {
      await new Promise(r => setTimeout(r, 2000))
      const r = await fetch('/api/admin/whatsapp/status')
      const data = await r.json()
      if (data.stateInstance === 'notAuthorized') return true
    }
    return false
  }

  async function handleGetQR() {
    setQrLoading(true)
    setQr(null)
    try {
      if (isConnected) {
        await fetch('/api/admin/whatsapp/logout', { method: 'POST' })
        setStatus('notAuthorized')
      }
      await fetch('/api/admin/whatsapp/reboot', { method: 'POST' })
      setStatus('sleeping')

      const ready = await waitForInstance()
      if (!ready) {
        setToast({ message: 'האתחול לקח זמן רב מדי, נסי שוב', type: 'error' })
        setQrLoading(false)
        return
      }

      const r = await fetch('/api/admin/whatsapp/qr')
      const data = await r.json()
      if (data.type === 'qrCode') {
        setQr(data.message)
        clearInterval(pollRef.current)
        pollRef.current = setInterval(fetchStatus, 3000)
      } else if (data.type === 'alreadyLogged') {
        fetchStatus()
        setToast({ message: 'המספר כבר מחובר', type: 'success' })
      } else {
        setToast({ message: 'לא ניתן לקבל QR כרגע', type: 'error' })
      }
    } catch {
      setToast({ message: 'שגיאה בתקשורת עם Green API', type: 'error' })
    }
    setQrLoading(false)
  }

  async function handleLogout() {
    if (!window.confirm('להתנתק מהמספר הנוכחי?')) return
    setLogoutLoading(true)
    try {
      const r = await fetch('/api/admin/whatsapp/logout', { method: 'POST' })
      const data = await r.json()
      if (data.isLogout) {
        setStatus('notAuthorized')
        setQr(null)
        setToast({ message: 'התנתקת בהצלחה', type: 'success' })
      }
    } catch {
      setToast({ message: 'שגיאה בהתנתקות', type: 'error' })
    }
    setLogoutLoading(false)
  }

  const isConnected = status === 'authorized'

  const statusConfig = {
    authorized:    { label: 'מחובר',      dot: 'bg-green-500',  badge: 'badge-success' },
    notAuthorized: { label: 'לא מחובר',   dot: 'bg-red-400',    badge: 'badge-danger'  },
    sleeping:      { label: 'ממתין',       dot: 'bg-yellow-400', badge: 'badge-primary' },
    error:         { label: 'שגיאה',       dot: 'bg-red-400',    badge: 'badge-danger'  },
  }[status] ?? { label: 'בודק...', dot: 'bg-gray-300', badge: 'badge-gray' }

  return (
    <>
      <h1 className="admin-page-title">הגדרות</h1>
      <p className="admin-page-subtitle">ניהול חיבורים ותצורת המערכת</p>

      <div className="card max-w-lg">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-lg bg-green-50 flex items-center justify-center text-3xl flex-shrink-0">
            📱
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-0.5">חיבור WhatsApp</h2>
            <p className="text-sm text-t2">ניהול המספר המחובר דרך Green API</p>
          </div>
        </div>

        {/* סטטוס */}
        <div className="flex items-center gap-3 mb-6 p-3 rounded-lg bg-surface border border-border">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${statusConfig.dot}`} />
          <span className="text-sm font-medium">סטטוס: </span>
          <span className={`badge ${statusConfig.badge}`}>{statusConfig.label}</span>
        </div>

        {/* כפתורי פעולה */}
        <div className="flex gap-3 flex-wrap mb-6">
          <button
            className="btn btn-primary gap-2"
            onClick={handleGetQR}
            disabled={qrLoading}
          >
            {qrLoading
              ? <><span className="spinner" />טוען QR...</>
              : isConnected ? '🔄 החלף מספר' : '📲 התחבר עם QR'
            }
          </button>

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

        {/* QR Code */}
        {qr && (
          <div className="border border-border rounded-xl p-5 flex flex-col items-center gap-3 bg-gray-50">
            <p className="text-sm font-medium text-t2">סרוק עם WhatsApp כדי להתחבר:</p>
            <img
              src={`data:image/png;base64,${qr}`}
              alt="QR Code"
              className="w-52 h-52 rounded-lg"
            />
            <p className="text-xs text-t2">הקוד מתרענן אוטומטית לאחר חיבור</p>
          </div>
        )}
      </div>

      <div className="card max-w-lg mt-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-lg bg-primary-bg flex items-center justify-center text-3xl flex-shrink-0">
            🔄
          </div>
          <div>
            <h2 className="font-semibold text-lg mb-0.5">סנכרון מוצרים</h2>
            <p className="text-sm text-t2">עדכון קטלוג המוצרים והמבצעים ממאטאון</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <span className={`sync-status-dot ${syncStatusConfig.dot}`} />
            <span className={`badge ${syncStatusConfig.badge}`}>{syncStatusConfig.text}</span>
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
          {syncStatus === 'running'
            ? <><span className="spinner" />מסנכרן...</>
            : <>🔄 סנכרן עכשיו</>
          }
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

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
