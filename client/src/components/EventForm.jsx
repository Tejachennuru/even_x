import React, { useState, useEffect } from 'react'
import { X, Upload, Calendar, MapPin, Users, Phone, Mail, User } from 'lucide-react'
import { adminAPI } from '../services/api'

const EVENT_TYPES = {
  tech: { label: 'Tech', color: 'bg-red-500' },
  cultural: { label: 'Cultural', color: 'bg-blue-500' },
  wellness: { label: 'Wellness', color: 'bg-green-500' },
  general: { label: 'General', color: 'bg-gray-800' },
}

export default function EventForm({ event, onClose, onSuccess }) {
  const isEditMode = !!event
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [imagePreview, setImagePreview] = useState(event?.poster_url || '')
  const [imageFile, setImageFile] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_time: '',
    end_time: '',
    type: 'general',
    ticket_available: false,
    gitam_price: 0,
    other_price: 0,
    footfall: 100,
    venue: '',
    poster_url: '',
    organizer_name: '',
    organizer_number: '',
    organizer_email: '',
    hospitality: {
      chairs: 0,
      tables: 0,
      electricity: false,
      food: '',
      others: '',
    },
    logistics: {
      sound: false,
      wifi: false,
      others: '',
    },
    is_live: true,
  })

  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name || '',
        description: event.description || '',
        start_time: event.start_time || '',
        end_time: event.end_time || '',
        type: event.type || 'general',
        ticket_available: event.ticket_available || false,
        gitam_price: event.gitam_price || 0,
        other_price: event.other_price || 0,
        footfall: event.footfall || 100,
        venue: event.venue || '',
        poster_url: event.poster_url || '',
        organizer_name: event.organizer_name || '',
        organizer_number: event.organizer_number || '',
        organizer_email: event.organizer_email || '',
        hospitality: event.hospitality || {
          chairs: 0,
          tables: 0,
          electricity: false,
          food: '',
          others: '',
        },
        logistics: event.logistics || {
          sound: false,
          wifi: false,
          others: '',
        },
        is_live: event.is_live !== undefined ? event.is_live : true,
      })
      setImagePreview(event.poster_url || '')
    }
  }, [event])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let posterUrl = formData.poster_url

      // Upload image if a new file was selected
      if (imageFile) {
        const uploadResponse = await adminAPI.uploadImage(imageFile)
        posterUrl = uploadResponse.data.url
      }

      const eventData = {
        ...formData,
        poster_url: posterUrl,
        gitam_price: Number(formData.gitam_price),
        other_price: Number(formData.other_price),
        footfall: Number(formData.footfall),
        hospitality: {
          ...formData.hospitality,
          chairs: Number(formData.hospitality.chairs),
          tables: Number(formData.hospitality.tables),
        },
      }

      if (isEditMode) {
        await adminAPI.updateEvent(event.id, eventData)
      } else {
        await adminAPI.createEvent(eventData)
      }

      onSuccess()
    } catch (err) {
      console.error('Form submission error:', err)
      setError(err.response?.data?.error || 'Failed to save event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className=" inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl my-8">
        <div className="p-4 sm-p-6 border-b flex items-center justify-between sticky top-0 bg-white z-10 rounded-t-lg">
          <h2 className="text-xl sm-text-2xl font-semibold">
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-md transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm-p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">{error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>
          )}

          {/* Event Basic Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Event Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                placeholder="Enter event name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={3}
                className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                placeholder="Describe the event"
              />
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 gap-3 sm-gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Time *
                </label>
                <input
                  type="datetime-local"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Time *
                </label>
                <input
                  type="datetime-local"
                  name="end_time"
                  value={formData.end_time}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Type *
              </label>
              <div className="grid grid-cols-2 sm-grid-cols-4 gap-2 sm-gap-3">
                {Object.entries(EVENT_TYPES).map(([key, { label, color }]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: key })}
                    className={`px-3 sm-px-4 py-2 rounded-md text-white font-medium text-sm sm-text-base ${color} ${
                      formData.type === key ? 'ring-2 ring-offset-2 ring-gray-800' : 'opacity-70'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Venue *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="venue"
                  value={formData.venue}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md pl-10"
                  placeholder="Event location"
                />
                <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Footfall *
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="footfall"
                  value={formData.footfall}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border rounded-md pl-10"
                  placeholder="Expected attendance"
                />
                <Users className="absolute left-3 top-3 text-gray-400" size={16} />
              </div>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Ticket Information</h3>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="ticket_available"
                id="ticket_available"
                checked={formData.ticket_available}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label htmlFor="ticket_available" className="text-sm font-medium text-gray-700">
                Tickets Required
              </label>
            </div>

            {formData.ticket_available && (
              <div className="grid grid-cols-1 md-grid-cols-2 gap-3 sm-gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GITAM Student Price (₹)
                  </label>
                  <input
                    type="number"
                    name="gitam_price"
                    value={formData.gitam_price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Other Student Price (₹)
                  </label>
                  <input
                    type="number"
                    name="other_price"
                    value={formData.other_price}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Event Poster */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Event Poster</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Poster Image
              </label>
              <div className="flex items-start gap-4">
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md cursor-pointer">
                  <Upload size={16} />
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
                {imagePreview && (
                  <img
                    src={imagePreview}
                    alt="Poster preview"
                    className="w-32 h-20 object-cover rounded-md border"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Organizer Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Organizer Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Organizer Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="organizer_name"
                  value={formData.organizer_name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border rounded-md pl-10"
                  placeholder="Name"
                />
                <User className="absolute left-3 top-3 text-gray-400" size={16} />
              </div>
            </div>

            <div className="grid grid-cols-1 md-grid-cols-2 gap-3 sm-gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="organizer_number"
                    value={formData.organizer_number}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md pl-10 text-sm sm-text-base"
                    placeholder="+91 9876543210"
                  />
                  <Phone className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="organizer_email"
                    value={formData.organizer_email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-md pl-10 text-sm sm-text-base"
                    placeholder="email@example.com"
                  />
                  <Mail className="absolute left-3 top-3 text-gray-400" size={16} />
                </div>
              </div>
            </div>
          </div>

          {/* Hospitality Requirements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Hospitality Requirements</h3>
            
            <div className="grid grid-cols-1 md-grid-cols-2 gap-3 sm-gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Chairs
                </label>
                <input
                  type="number"
                  value={formData.hospitality.chairs}
                  onChange={(e) => handleNestedChange('hospitality', 'chairs', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Tables
                </label>
                <input
                  type="number"
                  value={formData.hospitality.tables}
                  onChange={(e) => handleNestedChange('hospitality', 'tables', e.target.value)}
                  min="0"
                  className="w-full px-3 py-2 border rounded-md text-sm sm-text-base"
                  placeholder="0"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="electricity"
                checked={formData.hospitality.electricity}
                onChange={(e) => handleNestedChange('hospitality', 'electricity', e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="electricity" className="text-sm font-medium text-gray-700">
                Electricity Required
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Food Requirements
              </label>
              <input
                type="text"
                value={formData.hospitality.food}
                onChange={(e) => handleNestedChange('hospitality', 'food', e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Lunch for 100 people"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Requirements
              </label>
              <textarea
                value={formData.hospitality.others}
                onChange={(e) => handleNestedChange('hospitality', 'others', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Any other hospitality requirements"
              />
            </div>
          </div>

          {/* Logistics Requirements */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Logistics Requirements</h3>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sound"
                  checked={formData.logistics.sound}
                  onChange={(e) => handleNestedChange('logistics', 'sound', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="sound" className="text-sm font-medium text-gray-700">
                  Sound System Required
                </label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="wifi"
                  checked={formData.logistics.wifi}
                  onChange={(e) => handleNestedChange('logistics', 'wifi', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="wifi" className="text-sm font-medium text-gray-700">
                  WiFi Required
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Other Logistics
              </label>
              <textarea
                value={formData.logistics.others}
                onChange={(e) => handleNestedChange('logistics', 'others', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="e.g., Projector, Microphones, Stage setup"
              />
            </div>
          </div>

          {/* Event Status */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_live"
                id="is_live"
                checked={formData.is_live}
                onChange={handleInputChange}
                className="w-4 h-4"
              />
              <label htmlFor="is_live" className="text-sm font-medium text-gray-700">
                Publish Event (make it visible to users)
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm-flex-row items-stretch sm-items-center justify-end gap-2 sm-gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm-w-auto px-4 py-2 border rounded-md hover:bg-gray-50 text-sm sm-text-base"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-full sm-w-auto px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm sm-text-base"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}