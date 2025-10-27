import React from 'react'
import { ChevronLeft, MapPin, Clock, Calendar, ChevronRight } from 'lucide-react'
import { isSameDay, formatDateHuman, parseISODate } from '../utils/dateUtils'

export default function DayEventsView({ date, events = [], onEventClick, onBack }) {
  const d = date ? new Date(date) : new Date()
  const filtered = events.filter((e) => isSameDay(parseISODate(e.start_time), d))

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm-flex-row items-start sm-items-center gap-3 sm-gap-4 mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
          aria-label="Back to calendar"
        >
          <ChevronLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <div>
          <h3 className="text-xl sm-text-2xl font-bold text-gray-900">Events on {formatDateHuman(d)}</h3>
          <p className="text-sm text-gray-600 mt-1">{filtered.length} {filtered.length === 1 ? 'event' : 'events'} scheduled</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white p-8 sm-p-12 rounded-xl shadow-sm text-center">
          <div className="text-gray-400 mb-2">
            <Calendar size={48} className="mx-auto mb-3" />
          </div>
          <p className="text-gray-600 font-medium">No events scheduled for this day</p>
          <p className="text-sm text-gray-500 mt-1">Check other dates to find events</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden divide-y divide-gray-100">
          {filtered.map((ev) => (
            <button
              key={ev.id}
              onClick={() => onEventClick(ev)}
              className="w-full text-left px-4 sm-px-6 py-4 sm-py-5 hover:bg-purple-50 transition-colors flex flex-col sm-flex-row items-start gap-4"
              aria-label={`Open details for ${ev.name}`}
            >
              {/* Event Poster - Mobile: Full width, Desktop: Fixed width */}
              <div className="w-full sm-w-32 sm-flex-shrink-0">
                <img 
                  src={ev.poster_url} 
                  alt={ev.name} 
                  className="w-full h-40 sm-h-20 object-cover rounded-lg"
                />
              </div>

              {/* Event Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm-flex-row sm-items-start sm-justify-between gap-2 mb-2">
                  <h4 className="text-base sm-text-lg font-semibold text-gray-900 pr-4">
                    {ev.name}
                  </h4>
                  <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                    <Clock size={16} />
                    <span className="font-medium">
                      {new Date(ev.start_time).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                  <MapPin size={16} className="flex-shrink-0" />
                  <span>{ev.venue}</span>
                </div>

                {ev.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                    {ev.description}
                  </p>
                )}

                {/* Event Type Badge */}
                {ev.type && (
                  <span className={`
                    inline-block px-3 py-1 text-xs font-semibold rounded-full text-white
                    ${ev.type === 'tech' ? 'bg-red-500' :
                      ev.type === 'cultural' ? 'bg-blue-500' :
                      ev.type === 'wellness' ? 'bg-green-500' :
                      'bg-gray-800'}
                  `}>
                    {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                  </span>
                )}
              </div>

              {/* Arrow Icon - Hidden on mobile, visible on desktop */}
              <div className="hidden sm-flex items-center text-gray-400">
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}