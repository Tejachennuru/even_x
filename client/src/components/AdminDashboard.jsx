import React, { useState, useContext } from 'react'
import AuthContext from '../context/AuthContext'
import { Plus, Edit, Trash2, ChevronLeft } from 'lucide-react'
import EventForm from './EventForm'
import { adminAPI } from '../services/api'

export default function AdminDashboard({ events, setEvents, onBack }) {
  const { user } = useContext(AuthContext)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  if (!user) return <div className="bg-white p-6 rounded-lg">You must be logged in to view admin dashboard.</div>

  const handleCreateNew = () => {
    setEditingEvent(null)
    setShowForm(true)
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  const handleFormSuccess = async () => {
    // Refresh events list
    try {
      const response = await adminAPI.getAllEvents()
      setEvents(response.data)
      handleFormClose()
    } catch (error) {
      console.error('Failed to refresh events:', error)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      await adminAPI.deleteEvent(id)
      setEvents((prev) => prev.filter((e) => e.id !== id))
    } catch (error) {
      console.error('Failed to delete event:', error)
      alert('Failed to delete event')
    }
  }

  return (
    <div className="px-2 sm-px-0">
      <div className="flex flex-col sm-flex-row items-start sm-items-center justify-between gap-3 sm-gap-0 mb-4">
        <div className="flex items-center gap-2 sm-gap-3">
          <button onClick={onBack} className="inline-flex items-center gap-1 sm-gap-2 px-2 sm-px-3 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-sm sm-text-base">
            <ChevronLeft size={18} className="sm-w-5 sm-h-5" /> Back
          </button>
          <h3 className="text-lg sm-text-xl font-semibold">Admin Dashboard</h3>
        </div>
        <div className="w-full sm-w-auto">
          <button 
            onClick={handleCreateNew} 
            className="w-full sm-w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700 text-sm sm-text-base"
          >
            <Plus size={18} /> New Event
          </button>
        </div>
      </div>

      {user.role !== 'admin' && (
        <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg mb-4">
          You have view-only access. Only admins can create, edit, or delete events.
        </div>
      )}

      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="bg-white p-8 rounded-lg text-center text-gray-500">
            No events found. Click "New Event" to create one.
          </div>
        ) : (
          events.map((ev) => (
            <div key={ev.id} className="bg-white p-3 sm-p-4 rounded-lg shadow-sm flex flex-col sm-flex-row items-start sm-items-center justify-between gap-3 sm-gap-0">
              <div className="flex items-start sm-items-center gap-3 sm-gap-4 w-full sm-w-auto">
                {ev.poster_url && (
                  <img 
                    src={ev.poster_url} 
                    alt={ev.name} 
                    className="w-16 h-16 sm-w-20 sm-h-20 object-cover rounded-md flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-base sm-text-lg truncate">{ev.name}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {ev.venue} • {new Date(ev.start_time).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1 flex flex-wrap gap-2">
                    {ev.type && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-white ${
                        ev.type === 'tech' ? 'bg-red-500' :
                        ev.type === 'cultural' ? 'bg-blue-500' :
                        ev.type === 'wellness' ? 'bg-green-500' :
                        'bg-gray-800'
                      }`}>
                        {ev.type}
                      </span>
                    )}
                    {!ev.is_live && (
                      <span className="inline-block px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                        Draft
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {user.role === 'admin' && (
                <div className="flex items-center gap-2 w-full sm-w-auto justify-end sm-justify-start">
                  <button 
                    onClick={() => handleEdit(ev)} 
                    className="flex-1 sm-flex-none px-3 py-2 sm-p-2 rounded-md hover:bg-gray-100 text-sm sm-text-base inline-flex items-center justify-center gap-1"
                    title="Edit event"
                  >
                    <Edit size={18} /> <span className="sm-hidden">Edit</span>
                  </button>
                  <button 
                    onClick={() => handleDelete(ev.id)} 
                    className="flex-1 sm-flex-none px-3 py-2 sm-p-2 rounded-md hover:bg-red-50 text-red-600 text-sm sm-text-base inline-flex items-center justify-center gap-1"
                    title="Delete event"
                  >
                    <Trash2 size={18} /> <span className="sm-hidden">Delete</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showForm && (
        <EventForm
          event={editingEvent}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}