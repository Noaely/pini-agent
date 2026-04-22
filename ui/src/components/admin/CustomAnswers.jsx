import { useState, useEffect } from 'react'
import Modal from './shared/Modal'
import Toast from './shared/Toast'

export default function CustomAnswers() {
  const [answers, setAnswers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ category: '', trigger: '', answer: '' })
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const r = await fetch('/api/admin/custom-answers')
    const data = await r.json()
    setAnswers(data.answers || [])
  }

  function openNew() {
    setEditing(null)
    setForm({ category: '', trigger: '', answer: '' })
    setShowModal(true)
  }

  function openEdit(ans) {
    setEditing(ans)
    setForm({ category: ans.category, trigger: ans.trigger, answer: ans.answer })
    setShowModal(true)
  }

  async function save() {
    if (!form.trigger.trim() || !form.answer.trim()) return
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/custom-answers/${editing.id}` : '/api/admin/custom-answers'
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setShowModal(false)
    setToast({ message: editing ? 'התשובה עודכנה' : 'התשובה נוספה', type: 'success' })
    load()
  }

  async function remove(id) {
    await fetch(`/api/admin/custom-answers/${id}`, { method: 'DELETE' })
    setToast({ message: 'התשובה נמחקה', type: 'success' })
    load()
  }

  const filtered = answers.filter(a =>
    a.trigger.includes(search) || a.category.includes(search) || a.answer.includes(search)
  )

  return (
    <>
      <h1 className="admin-page-title">תשובות לדוגמה</h1>
      <p className="admin-page-subtitle">תשובות מוכנות שהצ׳אט ישתמש בהן אוטומטית</p>

      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <div className="search-bar flex-1 max-w-xs">
            🔍
            <input
              placeholder="חפש תשובה..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ הוסף תשובה</button>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>קטגוריה</th>
              <th>שאלה / טריגר</th>
              <th>תשובה מוכנה</th>
              <th className="w-[90px]">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(ans => (
              <tr key={ans.id}>
                <td><span className="badge badge-primary">{ans.category || 'כללי'}</span></td>
                <td className="text-t2">{ans.trigger}</td>
                <td className="max-w-[300px] overflow-hidden text-ellipsis whitespace-nowrap">
                  {ans.answer}
                </td>
                <td>
                  <div className="flex gap-1">
                    <button className="btn-icon" onClick={() => openEdit(ans)}>✏️</button>
                    <button className="btn-icon" onClick={() => remove(ans.id)}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="4">
                  <div className="empty-state p-8">
                    <div className="empty-state-icon">📝</div>
                    <div className="empty-state-text">אין תשובות עדיין</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'ערוך תשובה' : 'הוסף תשובה'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-primary" onClick={save}>שמור</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>ביטול</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">קטגוריה</label>
            <input
              className="form-input"
              placeholder='למשל: "שעות פעילות", "משלוחים"'
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">שאלה / טריגר</label>
            <input
              className="form-input"
              placeholder="מה הלקוח שואל..."
              value={form.trigger}
              onChange={e => setForm(f => ({ ...f, trigger: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">תשובה מוכנה</label>
            <textarea
              className="form-textarea min-h-[100px]"
              placeholder="התשובה שהצ׳אט יגיד..."
              value={form.answer}
              onChange={e => setForm(f => ({ ...f, answer: e.target.value }))}
            />
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
