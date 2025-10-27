import React, { useContext, useState } from 'react'
import { Calendar, Settings, LogOut, Menu, X } from 'lucide-react'
import AuthContext from '../context/AuthContext'

export default function Navbar({ currentView, setCurrentView }) {
  const { user, logout } = useContext(AuthContext)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleNavClick = (view) => {
    setCurrentView(view)
    setMobileMenuOpen(false)
  }

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)
  }

  return (
    <header className="bg-white-70 header-blur sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-lg">
              EV
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold">EvenX</div>
              <div className="text-xs text-gray-600">Campus events</div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2" role="navigation" aria-label="Main navigation">
            <button
              onClick={() => setCurrentView('calendar')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                currentView === 'calendar' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar size={18} />
              <span className="font-medium">Calendar</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => setCurrentView('admin')}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  currentView === 'admin' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={18} />
                <span className="font-medium">Admin</span>
              </button>
            )}

            {user && (
              <>
                <div className="px-3 py-2 text-sm">
                  <span className="font-semibold text-purple-600">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                >
                  <LogOut size={18} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-2 border-t border-gray-200 pt-4" role="navigation" aria-label="Mobile navigation">
            <button
              onClick={() => handleNavClick('calendar')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                currentView === 'calendar' 
                  ? 'bg-purple-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Calendar size={20} />
              <span className="font-medium">Calendar</span>
            </button>

            {user?.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentView === 'admin' 
                    ? 'bg-purple-600 text-white' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Settings size={20} />
                <span className="font-medium">Admin Dashboard</span>
              </button>
            )}

            {user && (
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div className="px-4 py-2 text-sm text-gray-600">
                  Logged in as <span className="font-semibold text-purple-600">{user.role}</span>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Logout</span>
                </button>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}