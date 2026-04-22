import { useState, useEffect } from 'react'
import Modal from './shared/Modal'
import Toast from './shared/Toast'

export default function ChatExamples({ onSwitchToChat }) {
  const [examples, setExamples] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', prompt: '' })
  const [toast, setToast] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const r = await fetch('/api/admin/chat-examples')
    const data = await r.json()
    setExamples(data.examples || [])
  }

  function openNew() {
    setEditing(null)
    setForm({ title: '', prompt: '' })
    setShowModal(true)
  }

  function openEdit(ex) {
    setEditing(ex)
    setForm({ title: ex.title, prompt: ex.prompt })
    setShowModal(true)
  }

  async function save() {
    if (!form.title.trim() || !form.prompt.trim()) return
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/chat-examples/${editing.id}` : '/api/admin/chat-examples'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowModal(false)
    setToast({ message: editing ? 'הדוגמה עודכנה' : 'הדוגמה נוספה', type: 'success' })
    load()
  }

  async function remove(id) {
    await fetch(`/api/admin/chat-examples/${id}`, { method: 'DELETE' })
    setToast({ message: 'הדוגמה נמחקה', type: 'success' })
    load()
  }

  return (
    <>
      <h1 className="admin-page-title">דוגמאות צ׳אט</h1>
      <p className="admin-page-subtitle">שאלות ובקשות לדוגמה שהצ׳אט יודע לטפל בהן</p>

      <div className="page-toolbar">
        <div className="page-toolbar-left" />
        <button className="btn btn-primary" onClick={openNew}>+ הוסף דוגמה</button>
      </div>

      <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
        {examples.map(ex => (
          <div key={ex.id} className="card flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-t1 flex-1">{ex.title}</h3>
              <div className="flex gap-1 flex-shrink-0">
                <button className="btn-icon" title="ערוך" onClick={() => openEdit(ex)}>✏️</button>
                <button className="btn-icon" title="מחק" onClick={() => remove(ex.id)}>🗑️</button>
              </div>
            </div>

            <p className="text-sm text-t2 bg-s2 border border-border rounded-md px-4 py-2 leading-relaxed flex-1">
              &ldquo;{ex.prompt}&rdquo;
            </p>

            <button
              className="btn btn-primary w-full justify-center"
              onClick={() => onSwitchToChat(ex.prompt)}
            >
              ▶ נסה בצ׳אט
            </button>
          </div>
        ))}

        {!examples.length && (
          <div className="empty-state col-span-full">
            <div className="empty-state-icon">💬</div>
            <div className="empty-state-text">אין דוגמאות עדיין – הוסף את הראשונה!</div>
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          title={editing ? 'ערוך דוגמה' : 'הוסף דוגמה'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-primary" onClick={save}>שמור</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>ביטול</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">כותרת</label>
            <input
              className="form-input"
              placeholder='למשל: "תפריט ל-10 אנשים ב-1,000 ₪"'
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">בקשה לדוגמה</label>
            <textarea
              className="form-textarea"
              placeholder="הטקסט שיישלח לצ׳אט..."
              value={form.prompt}
              onChange={e => setForm(f => ({ ...f, prompt: e.target.value }))}
            />
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
