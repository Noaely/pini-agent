import { useState, useEffect } from 'react'
import Modal from './shared/Modal'
import Toast from './shared/Toast'

export default function ProductManager() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('הכל')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', price: '', unit: 'ק״ג' })
  const [toast, setToast] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const r = await fetch('/api/admin/products')
    const data = await r.json()
    setProducts(data.products || [])
  }

  const categories = ['הכל', ...new Set(products.map(p => p.category).filter(Boolean))]

  const filtered = products.filter(p => {
    const matchSearch = p.name.includes(search) || (p.category || '').includes(search)
    const matchCat = categoryFilter === 'הכל' || p.category === categoryFilter
    return matchSearch && matchCat
  })

  function openNew() {
    setEditing(null)
    setForm({ name: '', category: '', price: '', unit: 'ק״ג' })
    setShowModal(true)
  }

  function openEdit(p) {
    setEditing(p)
    setForm({ name: p.name, category: p.category || '', price: String(p.price), unit: p.unit || 'ק״ג' })
    setShowModal(true)
  }

  async function save() {
    if (!form.name.trim() || !form.price) return
    const body = { name: form.name, category: form.category, price: Number(form.price), unit: form.unit }
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/products/${editing.id}` : '/api/admin/products'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setShowModal(false)
    setToast({ message: editing ? 'המוצר עודכן' : 'המוצר נוסף', type: 'success' })
    load()
  }

  async function remove(id, source) {
    if (source !== 'custom') return
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
    setToast({ message: 'המוצר נמחק', type: 'success' })
    load()
  }

  return (
    <>
      <h1 className="admin-page-title">ניהול מוצרים</h1>
      <p className="admin-page-subtitle">כל המוצרים שהצ׳אט יודע עליהם</p>

      <div className="page-toolbar">
        <div className="page-toolbar-left">
          <div className="search-bar max-w-[280px]">
            🔍
            <input placeholder="חפש מוצר..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select w-auto" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={openNew}>+ הוסף מוצר</button>
      </div>

      <div className="mb-2 text-xs text-t2">
        מציג {filtered.length} מתוך {products.length} מוצרים
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>שם המוצר</th>
              <th>קטגוריה</th>
              <th>מחיר</th>
              <th>יחידה</th>
              <th>מקור</th>
              <th className="w-[90px]">פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={`${p.source}-${p.id}`}>
                <td className="font-medium">{p.name}</td>
                <td><span className="badge badge-gray">{p.category || '—'}</span></td>
                <td><span className="badge badge-success">₪{p.price}</span></td>
                <td className="text-t2 text-xs">{p.unit || 'ק״ג'}</td>
                <td>
                  {p.source === 'custom'
                    ? <span className="badge badge-primary">✏️ ידני</span>
                    : <span className="badge badge-gray">🌐 סקריפר</span>}
                </td>
                <td>
                  <div className="flex gap-1">
                    {p.source === 'custom' ? (
                      <>
                        <button className="btn-icon" onClick={() => openEdit(p)}>✏️</button>
                        <button className="btn-icon" onClick={() => remove(p.id, p.source)}>🗑️</button>
                      </>
                    ) : (
                      <span title="מוצרי סקריפר לא ניתנים לעריכה" className="text-base">🔒</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan="6">
                  <div className="empty-state p-8">
                    <div className="empty-state-icon">🥩</div>
                    <div className="empty-state-text">לא נמצאו מוצרים – הרץ סנכרון או הוסף ידנית</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal
          title={editing ? 'ערוך מוצר' : 'הוסף מוצר'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-primary" onClick={save}>שמור</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>ביטול</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">שם המוצר</label>
            <input className="form-input" placeholder="למשל: רוסטביף אנטריקוט" value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">קטגוריה</label>
            <input className="form-input" placeholder="למשל: בקר טרי, עוף..." value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">מחיר (₪)</label>
              <input className="form-input" type="number" placeholder="150" value={form.price}
                onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">יחידה</label>
              <select className="form-select" value={form.unit}
                onChange={e => setForm(f => ({ ...f, unit: e.target.value }))}>
                <option value="ק״ג">ק״ג</option>
                <option value="יח׳">יח׳</option>
                <option value="מנה">מנה</option>
                <option value="חבילה">חבילה</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
