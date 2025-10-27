import React, { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Lock } from 'lucide-react'

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
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-3">Admin Login</h3>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-700">Password</label>
          <div className="mt-1 relative">
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" 
              className="w-full px-3 py-2 border rounded-md"
              disabled={loading}
              required
            />
            <span className="absolute right-3 top-3 text-gray-400"><Lock size={16} /></span>
          </div>
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-between">
          <button 
            type="submit" 
            className="px-4 py-2 bg-purple-600 text-white rounded-md"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <div className="text-sm text-gray-500">
            Use password <span className="font-medium">thetechx</span> (admin) or <span className="font-medium">pramana_admin</span> (viewer)
          </div>
        </div>
      </form>
    </div>
  )
}