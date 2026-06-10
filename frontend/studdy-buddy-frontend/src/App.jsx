import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AuthPage  from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import ChatPage from './pages/ChatPage'

function AppLayout() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/auth" replace />

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-56 p-8">
        <Routes>
          <Route path="/"  element={<Dashboard />} />
          <Route path='/chat' element={<ChatPage/>}/>
          <Route path="*"  element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

function AuthGate() {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : <AuthPage />
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth" element={<AuthGate />} />
        <Route path="/*"    element={<AppLayout />} />
      </Routes>
    </AuthProvider>
  )
}