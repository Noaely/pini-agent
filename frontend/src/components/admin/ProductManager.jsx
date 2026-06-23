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

  return (
    <>
      <div>
        <h1 className="admin-page-title">ניהול מוצרים</h1>
        <p className="admin-page-subtitle">כל המוצרים שהצ׳אט יודע עליהם</p>
      </div>

      <section className="bg-white border border-[#e2e7ee] rounded-2xl p-5 shadow-[0_4px_24px_rgba(29,78,216,0.06)]">
        {/* card head */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-9 h-9 rounded-xl bg-[#1d4ed8]/10 text-[#1d4ed8] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
          </span>
          <span className="text-[#0d1b2e] text-base font-bold">קטלוג מוצרים</span>
          <span className="mr-auto text-[#5a6678] text-sm">
            מציג <b className="text-[#0d1b2e] font-bold">{filtered.length}</b> מתוך {products.length}
          </span>
        </div>

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="flex items-center gap-2 bg-[#f4f7fb] border border-[#e2e7ee] rounded-xl px-3 py-2 min-w-[220px] focus-within:border-[#1d4ed8] focus-within:bg-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-[#9eb3d4] flex-shrink-0"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חפש מוצר…"
              className="bg-transparent outline-none text-sm text-[#0d1b2e] flex-1 placeholder:text-[#9eb3d4]"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategoryFilter(c)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  categoryFilter === c
                    ? 'bg-[#1d4ed8] text-white shadow-[0_2px_8px_rgba(29,78,216,0.25)]'
                    : 'bg-[#f4f7fb] text-[#5a6678] hover:bg-[#e8f0fc] hover:text-[#0d1b2e]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1.5 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-[0_2px_10px_rgba(29,78,216,0.25)] transition-all"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
            הוסף מוצר
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#e2e7ee]">
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">שם המוצר</th>
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">קטגוריה</th>
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">מחיר</th>
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">יחידה</th>
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">מקור</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={`${p.source}-${p.id}`} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#f4f7fb] transition-colors">
                  <td className="py-3 px-2 text-[#0d1b2e] font-medium">{p.name}</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#eef2ff] text-[#4338ca] border border-[#e0e7ff]">
                      {p.category || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#16a34a]/10 text-[#15803d]">
                      ₪<b>{p.price}</b>
                    </span>
                  </td>
                  <td className="py-3 px-2 text-[#5a6678] text-xs">{p.unit || 'ק״ג'}</td>
                  <td className="py-3 px-2">
                    {p.source === 'custom' ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-[#1d4ed8]/10 text-[#1d4ed8]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-3.5 h-3.5"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                        ידני
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#f4f7fb] text-[#5a6678] border border-[#e2e7ee]">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-3.5 h-3.5"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>
                        סקרייפר
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan="5">
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

        <div className="mt-4 pt-3 border-t border-[#eef1f6] text-xs text-[#5a6678]">
          מוצגים {filtered.length} מתוך {products.length} מוצרים
        </div>
      </section>

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
