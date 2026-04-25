import { useState, useEffect } from 'react'

function formatPhone(phone) {
  const str = String(phone)
  if (str.startsWith('972') && str.length >= 11) {
    return `+972-${str.slice(3, 5)}-${str.slice(5, 8)}-${str.slice(8)}`
  }
  return `+${str}`
}

export default function Header() {
  const [phone, setPhone]         = useState(null)
  const [avatarUrl, setAvatarUrl] = useState(null)

  useEffect(() => {
    fetch('/api/admin/whatsapp/status')
      .then(r => r.json())
      .then(data => {
        if (data.stateInstance === 'authorized' && data.phone) {
          setPhone(data.phone)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!phone) return
    fetch('/api/admin/whatsapp/avatar')
      .then(r => r.json())
      .then(data => { if (data.avatarUrl) setAvatarUrl(data.avatarUrl) })
      .catch(() => {})
  }, [phone])

  const displayName = phone ? formatPhone(phone) : 'מנהל'
  const initials    = phone ? phone.slice(-2) : 'מ'

  return (
    <header className="app-header">
      <div className="logo">
        <img src="/logo.png" alt="Meatown" className="h-[52px] w-[52px] rounded-md object-contain" />
        <span className="logo-text">Meatown</span>
      </div>

      <div className="header-user">
        <div className="text-right">
          <div className="header-user-name">{displayName}</div>
        </div>
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="avatar"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="header-avatar">{initials}</div>
        )}
      </div>
    </header>
  )
}
