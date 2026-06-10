import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('sb_user')
      return s ? JSON.parse(s) : null
    } catch {
      return null
    }
  })

  function login(data) {
    localStorage.setItem('sb_user', JSON.stringify(data))
    setUser(data)
  }

  function logout() {
    localStorage.removeItem('sb_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}