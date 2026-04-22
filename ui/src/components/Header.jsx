export default function Header() {
  return (
    <header className="app-header">
      <div className="logo">
        <img src="/logo.png" alt="Meatown" className="h-[52px] w-[52px] rounded-md object-contain" />
        <span className="logo-text">Meatown</span>
      </div>

      <div className="header-user">
        <div className="text-right">
          <div className="header-user-name">מנהל</div>
          <div className="header-user-role">Admin Store</div>
        </div>
        <div className="header-avatar">מ</div>
      </div>
    </header>
  )
}
