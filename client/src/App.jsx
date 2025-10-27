import React, { useState, useEffect, useContext } from 'react'
import './App.css'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import AuthContext from './context/AuthContext'
import Navbar from './components/Navbar'
import CalendarView from './components/CalendarView'
import DayEventsView from './components/DayEventsView'
import EventDetailsView from './components/EventDetailsView'
import LoginView from './components/LoginView'
import AdminDashboard from './components/AdminDashboard'
import { eventsAPI, adminAPI } from './services/api'

function AppContent() {
  const { user, loading } = useContext(AuthContext)
  const [currentView, setCurrentView] = useState(() => (user ? 'calendar' : 'login'))
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [events, setEvents] = useState([])
  const [eventsLoading, setEventsLoading] = useState(false)

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      if (!user) return
      
      setEventsLoading(true)
      try {
        // Fetch all events (including drafts) for admin, only live events for viewers
        const response = user.role === 'admin' 
          ? await adminAPI.getAllEvents()
          : await eventsAPI.getAll()
        setEvents(response.data)
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setEventsLoading(false)
      }
    }

    fetchEvents()
  }, [user, currentView])

  // If the app was refreshed and a user is already present, ensure we show the calendar
  useEffect(() => {
    if (user && currentView === 'login') {
      setCurrentView('calendar')
    }
  }, [user])

  // Handle successful login
  const handleLoginSuccess = () => {
    // Both admin and viewer go directly to calendar
    setCurrentView('calendar')
  }

  // Show loading while verifying token
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    )
  }

  // Show login if not authenticated
  if (!user) {
    return (
      <div className="app-bg min-h-screen">
        <main className="container mx-auto px-4 py-8">
          <LoginView onSuccess={handleLoginSuccess} />
        </main>
      </div>
    )
  }

  return (
    <div className="app-bg min-h-screen">
      <Navbar currentView={currentView} setCurrentView={setCurrentView} />

      <main className="container mx-auto px-4 py-8">
        {eventsLoading && currentView === 'calendar' && (
          <div className="text-center text-gray-600">Loading events...</div>
        )}

        {currentView === 'calendar' && (
          <CalendarView
            events={events}
            onDateClick={(date) => {
              setSelectedDate(date)
              setCurrentView('dayEvents')
            }}
          />
        )}

        {currentView === 'dayEvents' && (
          <DayEventsView
            date={selectedDate}
            events={events}
            onEventClick={(event) => {
              setSelectedEvent(event)
              setCurrentView('eventDetails')
            }}
            onBack={() => setCurrentView('calendar')}
          />
        )}

        {currentView === 'eventDetails' && (
          <EventDetailsView event={selectedEvent} onBack={() => setCurrentView('dayEvents')} />
        )}

        {currentView === 'admin' && user?.role === 'admin' && (
          <AdminDashboard events={events} setEvents={setEvents} onBack={() => setCurrentView('calendar')} />
        )}
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App