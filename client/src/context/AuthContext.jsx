import React, { useState, useEffect } from 'react'
import { authAPI } from '../services/api'

export const AuthContext = React.createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verify existing token on app load
    const verifyToken = async () => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        try {
          const response = await authAPI.verify()
          setUser(response.data.user)
        } catch (error) {
          console.error('Token verification failed:', error)
          localStorage.removeItem('auth_token')
          localStorage.removeItem('evenx_user')
        }
      }
      setLoading(false)
    }
    verifyToken()
  }, [])

  const login = async (password) => {
    try {
      const response = await authAPI.login(password)
      const { token, role } = response.data
      
      const user = { role }
      setUser(user)
      localStorage.setItem('auth_token', token)
      localStorage.setItem('evenx_user', JSON.stringify(user))
      return { success: true }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('auth_token')
    localStorage.removeItem('evenx_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
