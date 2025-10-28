import React, { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Lock } from 'lucide-react'
import './LoginView.css'

export default function LoginView({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useContext(AuthContext)

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const result = await login(password)
    setLoading(false)
    
    if (result.success) {
      onSuccess()
    } else {
      setError(result.error || 'Invalid password')
    }
  }

  return (
    <div className="login-card">
      <h3 className="login-title">Admin Login</h3>
      <form onSubmit={submit} className="login-form">
        <div>
          <label className="login-label">Password</label>
          <div className="login-input-wrap">
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              className="login-input"
              disabled={loading}
              required
            />
            <span className="login-lock"><Lock size={16} /></span>
          </div>
        </div>

        {error && <div className="login-error">{error}</div>}

        <div className="login-actions">
          <button 
            type="submit" 
            className="login-btn"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
    </div>
  )
}