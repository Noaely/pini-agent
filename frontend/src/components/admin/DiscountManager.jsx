import { useState, useEffect } from 'react'
import Modal from './shared/Modal'
import Toast from './shared/Toast'

export default function DiscountManager() {
  const [tab, setTab] = useState('scraped')
  const [scraped, setScraped] = useState([])
  const [custom, setCustom] = useState([])
  const [allProducts, setAllProducts] = useState([])
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

  const displayed = tab === 'scraped' ? scraped : custom

  return (
    <>
      <h1 className="admin-page-title">ניהול מבצעים</h1>
      <p className="admin-page-subtitle">מבצעים מהאתר ומבצעים שהוספת ידנית</p>

      <div className="flex justify-between items-center mb-6">
        <div className="tabs !mb-0">
          <button className={`tab${tab === 'scraped' ? ' active' : ''}`} onClick={() => setTab('scraped')}>
            🌐 מבצעי האתר ({scraped.length})
          </button>
          <button className={`tab${tab === 'custom' ? ' active' : ''}`} onClick={() => setTab('custom')}>
            ✏️ מבצעים ידניים ({custom.length})
          </button>
        </div>
        {tab === 'custom' && (
          <button className="btn btn-primary" onClick={openNew}>+ הוסף מבצע</button>
        )}
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>שם המבצע</th>
              <th>מחיר</th>
              <th>מינ׳ מוצרים</th>
              <th>מוצרים רלוונטיים</th>
              {tab === 'custom' && <th className="w-[90px]">פעולות</th>}
            </tr>
          </thead>
          <tbody>
            {displayed.map(d => (
              <tr key={d.id}>
                <td className="font-medium">{d.title}</td>
                <td><span className="badge badge-success">₪{d.amount}</span></td>
                <td className="text-t2">{d.min_products || 1}</td>
                <td className="text-xs text-t2 max-w-[240px]">
                  {d.applicable_products?.slice(0, 3).map(p => p.name).join(', ')}
                  {d.applicable_products?.length > 3 && ` +${d.applicable_products.length - 3}`}
                </td>
                {tab === 'custom' && (
                  <td>
                    <div className="flex gap-1">
                      <button className="btn-icon" onClick={() => openEdit(d)}>✏️</button>
                      <button className="btn-icon" onClick={() => remove(d.id)}>🗑️</button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
            {!displayed.length && (
              <tr>
                <td colSpan="5">
                  <div className="empty-state p-8">
                    <div className="empty-state-icon">🏷️</div>
                    <div className="empty-state-text">
                      {tab === 'scraped' ? 'הרץ סנכרון כדי לטעון מבצעים' : 'אין מבצעים ידניים'}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
