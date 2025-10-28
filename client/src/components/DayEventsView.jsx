import React from 'react'
import { ChevronLeft, MapPin, Clock, Calendar, ChevronRight } from 'lucide-react'
import { isSameDay, formatDateHuman, parseISODate } from '../utils/dateUtils'
import './DayEventsView.css'

export default function DayEventsView({ date, events = [], onEventClick, onBack }) {
  const d = date ? new Date(date) : new Date()
  const filtered = events.filter((e) => isSameDay(parseISODate(e.start_time), d))

  return (
    <div className="dev-container">
      {/* Header */}
      <div className="dev-header">
        <button onClick={onBack} className="dev-back" aria-label="Back to calendar">
          <ChevronLeft size={20} />
          <span>Back</span>
        </button>
        <div>
          <h3 className="dev-title">Events on {formatDateHuman(d)}</h3>
          <p className="dev-sub">{filtered.length} {filtered.length === 1 ? 'event' : 'events'} scheduled</p>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="dev-empty">
          <div className="dev-empty-illustration">
            <Calendar size={48} />
          </div>
          <p className="dev-empty-title">No events scheduled for this day</p>
          <p className="dev-empty-sub">Check other dates to find events</p>
        </div>
      ) : (
        <div className="dev-list">
          {filtered.map((ev) => (
            <button
              key={ev.id}
              onClick={() => onEventClick(ev)}
              className="dev-list-item"
              aria-label={`Open details for ${ev.name}`}
            >
              {/* Event Poster - Mobile: Full width, Desktop: Fixed width */}
              <div className="dev-poster">
                <img src={ev.poster_url} alt={ev.name} className="dev-poster-img" />
              </div>

              {/* Event Details */}
              <div className="dev-details">
                <div className="dev-details-top">
                  <h4 className="dev-ev-name">{ev.name}</h4>
                  <div className="dev-ev-time">
                    <Clock size={16} />
                    <span>{new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                <div className="dev-venue">
                  <MapPin size={16} />
                  <span>{ev.venue}</span>
                </div>

                {ev.description && (
                  <p className="dev-desc">{ev.description}</p>
                )}

                {ev.type && (
                  <span className={`dev-type ${ev.type === 'tech' ? 'type-tech' : ev.type === 'cultural' ? 'type-cultural' : ev.type === 'wellness' ? 'type-wellness' : 'type-general'}`}>
                    {ev.type.charAt(0).toUpperCase() + ev.type.slice(1)}
                  </span>
                )}
              </div>

              <div className="dev-arrow">
                <ChevronRight size={20} />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}