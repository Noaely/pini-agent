import Header from './components/Header'
import AdminLayout from './components/admin/AdminLayout'
import './App.css'

export default function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <AdminLayout />
      </main>
    </div>
  )
}
