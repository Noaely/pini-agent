import { useState, useEffect } from 'react'
import Modal from './shared/Modal'
import Toast from './shared/Toast'
import Pagination from './shared/Pagination'

const PAGE_SIZE = 20

export default function DiscountManager() {
  const [tab, setTab] = useState('scraped')
  const [scraped, setScraped] = useState([])
  const [custom, setCustom] = useState([])
  const [allProducts, setAllProducts] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ title: '', description: '', amount: '', min_products: '1', applicable_products: [] })
  const [toast, setToast] = useState(null)

  useEffect(() => { load() }, [])

  async function load() {
    const [discR, prodR] = await Promise.all([
      fetch('/api/admin/discounts'),
      fetch('/api/admin/products'),
    ])
    const discData = await discR.json()
    const prodData = await prodR.json()
    setScraped(discData.scraped || [])
    setCustom(discData.custom || [])
    setAllProducts(prodData.products || [])
  }

  function openNew() {
    setEditing(null)
    setForm({ title: '', description: '', amount: '', min_products: '1', applicable_products: [] })
    setShowModal(true)
  }

  function openEdit(d) {
    setEditing(d)
    setForm({
      title: d.title,
      description: d.description || '',
      amount: String(d.amount),
      min_products: String(d.min_products || 1),
      applicable_products: d.applicable_products.map(p => p.id),
    })
    setShowModal(true)
  }

  async function save() {
    if (!form.title.trim() || !form.amount) return
    const body = {
      title: form.title,
      description: form.description,
      amount: Number(form.amount),
      min_products: Number(form.min_products),
      applicable_products: allProducts
        .filter(p => form.applicable_products.includes(p.id))
        .map(p => ({ id: p.id, name: p.name, price: p.price })),
    }
    const method = editing ? 'PUT' : 'POST'
    const url = editing ? `/api/admin/discounts/${editing.id}` : '/api/admin/discounts'
    await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setShowModal(false)
    setToast({ message: editing ? 'המבצע עודכן' : 'המבצע נוסף', type: 'success' })
    load()
  }

  async function remove(id) {
    await fetch(`/api/admin/discounts/${id}`, { method: 'DELETE' })
    setToast({ message: 'המבצע נמחק', type: 'success' })
    load()
  }

  function toggleProduct(id) {
    setForm(f => ({
      ...f,
      applicable_products: f.applicable_products.includes(id)
        ? f.applicable_products.filter(p => p !== id)
        : [...f.applicable_products, id],
    }))
  }

  const q = search.trim()
  const displayed = (tab === 'scraped' ? scraped : custom)
    .filter(d => !q || (d.title || '').includes(q))

  const pageCount = Math.ceil(displayed.length / PAGE_SIZE)
  const pageItems = displayed.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => { setPage(1) }, [tab, search])

  return (
    <>
      <div>
        <h1 className="admin-page-title">ניהול מבצעים</h1>
        <p className="admin-page-subtitle">מבצעים מהאתר ומבצעים שהוספת ידנית</p>
      </div>

      <section className="bg-white border border-[#e2e7ee] rounded-2xl p-5 shadow-[0_4px_24px_rgba(29,78,216,0.06)]">
        {/* card head */}
        <div className="flex items-center gap-2.5 mb-5">
          <span className="w-9 h-9 rounded-xl bg-[#1d4ed8]/10 text-[#1d4ed8] flex items-center justify-center flex-shrink-0">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]"><path d="M7.5 7.5h.01" /><path d="M2 9.5V4a2 2 0 0 1 2-2h5.5a2 2 0 0 1 1.4.6l9 9a2 2 0 0 1 0 2.8l-5.6 5.6a2 2 0 0 1-2.8 0l-9-9A2 2 0 0 1 2 9.5Z" /></svg>
          </span>
          <span className="text-[#0d1b2e] text-base font-bold">רשימת מבצעים</span>
          <span className="mr-auto text-[#5a6678] text-sm">
            <b className="text-[#0d1b2e] font-bold">{displayed.length}</b> מבצעים פעילים
          </span>
        </div>

        {/* toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="inline-flex bg-[#f4f7fb] border border-[#e2e7ee] rounded-xl p-1 gap-1">
            <button
              onClick={() => setTab('scraped')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'scraped' ? 'bg-white text-[#1d4ed8] shadow-sm' : 'text-[#5a6678] hover:text-[#0d1b2e]'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4"><circle cx="12" cy="12" r="9" /><path d="M3 12h18" /><path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" /></svg>
              מבצעי האתר
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${tab === 'scraped' ? 'bg-[#1d4ed8] text-white' : 'bg-[#e2e7ee] text-[#5a6678]'}`}>{scraped.length}</span>
            </button>
            <button
              onClick={() => setTab('custom')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                tab === 'custom' ? 'bg-white text-[#1d4ed8] shadow-sm' : 'text-[#5a6678] hover:text-[#0d1b2e]'
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
              מבצעים ידניים
              <span className={`inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold ${tab === 'custom' ? 'bg-[#1d4ed8] text-white' : 'bg-[#e2e7ee] text-[#5a6678]'}`}>{custom.length}</span>
            </button>
          </div>
          <div className="flex-1" />
          <div className="flex items-center gap-2 bg-[#f4f7fb] border border-[#e2e7ee] rounded-xl px-3 py-2 min-w-[200px] focus-within:border-[#1d4ed8] focus-within:bg-white transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="w-4 h-4 text-[#9eb3d4] flex-shrink-0"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="חפש מבצע…"
              className="bg-transparent outline-none text-sm text-[#0d1b2e] flex-1 placeholder:text-[#9eb3d4]"
            />
          </div>
          {tab === 'custom' && (
            <button
              onClick={openNew}
              className="inline-flex items-center gap-1.5 bg-[#1d4ed8] hover:bg-[#1e3a8a] text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-[0_2px_10px_rgba(29,78,216,0.25)] transition-all"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="w-4 h-4"><path d="M12 5v14M5 12h14" /></svg>
              מבצע חדש
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="border-b border-[#e2e7ee]">
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">שם המבצע</th>
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">מחיר</th>
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs text-center">מס׳ מוצרים</th>
                <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs">מוצרים רלוונטיים</th>
                {tab === 'custom' && <th className="pb-3 px-2 text-[#5a6678] font-semibold text-xs w-[90px]">פעולות</th>}
              </tr>
            </thead>
            <tbody>
              {pageItems.map(d => (
                <tr key={d.id} className="border-b border-[#eef1f6] last:border-0 hover:bg-[#f4f7fb] transition-colors">
                  <td className="py-3 px-2 text-[#0d1b2e] font-medium">{d.title}</td>
                  <td className="py-3 px-2">
                    <span className="inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold bg-[#16a34a]/10 text-[#15803d]">
                      ₪<b>{d.amount}</b>
                    </span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-[#eef2ff] text-[#4338ca] text-xs font-bold">
                      {d.min_products || 1}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex flex-wrap gap-1 max-w-[320px]">
                      {(d.applicable_products || []).slice(0, 3).map(p => (
                        <span key={p.id} className="inline-flex px-2 py-0.5 rounded-md bg-[#f4f7fb] text-[#5a6678] text-xs border border-[#e2e7ee]">{p.name}</span>
                      ))}
                      {(d.applicable_products?.length || 0) > 3 && (
                        <span className="inline-flex px-2 py-0.5 rounded-md bg-[#1d4ed8]/10 text-[#1d4ed8] text-xs font-semibold">
                          {d.applicable_products.length - 3}+
                        </span>
                      )}
                    </div>
                  </td>
                  {tab === 'custom' && (
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <button onClick={() => openEdit(d)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f4f7fb] border border-[#e2e7ee] text-[#5a6678] hover:bg-[#1d4ed8]/10 hover:text-[#1d4ed8] transition-colors">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
                        </button>
                        <button onClick={() => remove(d.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#f4f7fb] border border-[#e2e7ee] text-[#5a6678] hover:bg-[#e11d48]/10 hover:text-[#e11d48] transition-colors">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="w-4 h-4"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
              {!displayed.length && (
                <tr>
                  <td colSpan={tab === 'custom' ? 5 : 4}>
                    <div className="empty-state p-8">
                      <div className="empty-state-icon">🏷️</div>
                      <div className="empty-state-text">
                        {tab === 'scraped' ? 'הרץ סנכרון כדי לטעון מבצעים' : 'אין מבצעים ידניים עדיין — לחץ "מבצע חדש" כדי להוסיף'}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageCount={pageCount} onChange={setPage} />

        <div className="mt-4 pt-3 border-t border-[#eef1f6] text-xs text-[#5a6678]">
          {tab === 'scraped'
            ? `${displayed.length} מבצעים פעילים מתוך האתר`
            : `${displayed.length} מבצעים ידניים`}
        </div>
      </section>

      {showModal && (
        <Modal
          title={editing ? 'ערוך מבצע' : 'הוסף מבצע'}
          onClose={() => setShowModal(false)}
          footer={
            <>
              <button className="btn btn-primary" onClick={save}>שמור</button>
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>ביטול</button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label">שם המבצע</label>
            <input className="form-input" placeholder='למשל: "4 קבב ב-200 ₪"' value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">מחיר מבצע (₪)</label>
              <input className="form-input" type="number" placeholder="200" value={form.amount}
                onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">מינימום מוצרים</label>
              <input className="form-input" type="number" min="1" value={form.min_products}
                onChange={e => setForm(f => ({ ...f, min_products: e.target.value }))} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">תיאור (אופציונלי)</label>
            <textarea className="form-textarea" value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">מוצרים רלוונטיים ({form.applicable_products.length} נבחרו)</label>
            <div className="max-h-[200px] overflow-y-auto border border-border rounded-md p-2">
              {allProducts.map(p => (
                <label key={p.id} className="flex items-center gap-2 px-2 py-1 cursor-pointer rounded-sm hover:bg-s2">
                  <input type="checkbox" checked={form.applicable_products.includes(p.id)}
                    onChange={() => toggleProduct(p.id)} />
                  <span className="flex-1 text-sm">{p.name}</span>
                  <span className="text-xs text-t2">₪{p.price}</span>
                </label>
              ))}
              {!allProducts.length && (
                <p className="p-2 text-t2 text-sm">הרץ סנכרון תחילה</p>
              )}
            </div>
          </div>
        </Modal>
      )}

      {toast && <Toast {...toast} onDone={() => setToast(null)} />}
    </>
  )
}
