
import React from 'react'
import { ChevronLeft, MapPin, Users, Phone, Mail, Clock, Calendar, Tag, DollarSign, Utensils, Zap, Wifi, Speaker } from 'lucide-react'

const EVENT_TYPE_COLORS = {
  tech: { bg: 'bg-red-500', text: 'text-red-700', badge: 'bg-red-50' },
  cultural: { bg: 'bg-blue-500', text: 'text-blue-700', badge: 'bg-blue-50' },
  wellness: { bg: 'bg-green-500', text: 'text-green-700', badge: 'bg-green-50' },
  general: { bg: 'bg-gray-800', text: 'text-gray-700', badge: 'bg-gray-50' },
}

export default function EventDetailsView({ event, onBack }) {
  if (!event) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <div className="text-gray-500">No event selected</div>
      </div>
    )
  }

  const typeColors = EVENT_TYPE_COLORS[event.type] || EVENT_TYPE_COLORS.general

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header with Back Button */}
      <div className="mb-6">
        <button 
          onClick={onBack} 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <ChevronLeft size={20} /> 
          <span className="font-medium">Back to Events</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image */}
        <div className="relative h-96 overflow-hidden bg-gradient-to-br from-purple-100 to-blue-100">
          <img 
            src={event.poster_url} 
            alt={event.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
          
          {/* Event Type Badge */}
          <div className="absolute top-4 right-4">
            <span className={`inline-block px-4 py-2 rounded-full text-white font-semibold text-sm ${typeColors.bg} shadow-lg`}>
              {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'General'}
            </span>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2">{event.name}</h1>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{new Date(event.start_time).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>
                  {new Date(event.start_time).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {' - '}
                  {new Date(event.end_time).toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md-grid-cols-3 gap-8 p-8">
          {/* Main Content - 2 columns */}
          <div className="md-col-span-2 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">About This Event</h2>
              <p className="text-gray-700 leading-relaxed text-base">{event.description}</p>
            </section>

            {/* Hospitality */}
            {event.hospitality && (Object.values(event.hospitality).some(val => val)) && (
              <section className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Utensils size={20} className="text-purple-600" />
                  Hospitality Arrangements
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {event.hospitality.chairs > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-gray-700"><strong>{event.hospitality.chairs}</strong> Chairs</span>
                    </div>
                  )}
                  {event.hospitality.tables > 0 && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-600"></div>
                      <span className="text-gray-700"><strong>{event.hospitality.tables}</strong> Tables</span>
                    </div>
                  )}
                  {event.hospitality.electricity && (
                    <div className="flex items-center gap-2">
                      <Zap size={16} className="text-purple-600" />
                      <span className="text-gray-700">Electricity Available</span>
                    </div>
                  )}
                  {event.hospitality.food && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Utensils size={16} className="text-purple-600" />
                      <span className="text-gray-700">{event.hospitality.food}</span>
                    </div>
                  )}
                  {event.hospitality.others && (
                    <div className="col-span-2 text-gray-600 italic">
                      {event.hospitality.others}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Logistics */}
            {event.logistics && (Object.values(event.logistics).some(val => val)) && (
              <section className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Speaker size={20} className="text-blue-600" />
                  Logistics & Facilities
                </h3>
                <div className="flex flex-wrap gap-3">
                  {event.logistics.sound && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-sm">
                      <Speaker size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">Sound System</span>
                    </div>
                  )}
                  {event.logistics.wifi && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-md shadow-sm">
                      <Wifi size={16} className="text-blue-600" />
                      <span className="text-sm font-medium text-gray-700">WiFi Available</span>
                    </div>
                  )}
                </div>
                {event.logistics.others && (
                  <div className="mt-3 text-sm text-gray-600 italic">
                    {event.logistics.others}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Quick Info Card */}
            <div className="bg-gray-50 rounded-lg p-6 space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              
              <div className="flex items-start gap-3">
                <MapPin size={20} className="text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Venue</div>
                  <div className="text-sm font-medium text-gray-900">{event.venue}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users size={20} className="text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Expected Attendance</div>
                  <div className="text-sm font-medium text-gray-900">{event.footfall} people</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <DollarSign size={20} className="text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <div className="text-xs text-gray-500 uppercase font-medium">Tickets</div>
                  {event.ticket_available ? (
                    <div className="text-sm text-gray-900">
                      <div>GITAM: <strong>₹{event.gitam_price}</strong></div>
                      <div>Others: <strong>₹{event.other_price}</strong></div>
                    </div>
                  ) : (
                    <div className="text-sm font-medium text-green-600">Free Entry</div>
                  )}
                </div>
              </div>
            </div>

            {/* Organizer Card */}
            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Organizer</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-semibold">
                    {event.organizer_name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{event.organizer_name}</div>
                    <div className="text-xs text-gray-500">Event Organizer</div>
                  </div>
                </div>

                <div className="pt-3 border-t border-purple-200 space-y-2">
                  <a 
                    href={`tel:${event.organizer_number}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <Phone size={16} />
                    <span>{event.organizer_number}</span>
                  </a>
                  
                  <a 
                    href={`mailto:${event.organizer_email}`}
                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-purple-600 transition-colors"
                  >
                    <Mail size={16} />
                    <span className="break-all">{event.organizer_email}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
