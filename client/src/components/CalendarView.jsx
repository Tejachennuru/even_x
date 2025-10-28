import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { datesForMonth, isSameDay, formatDateHuman, parseISODate } from '../utils/dateUtils'
import './CalendarView.css'

const TYPE_COLORS = {
  tech: 'type-tech',
  cultural: 'type-cultural',
  wellness: 'type-wellness',
  general: 'type-general',
}

function eventsByDay(events) {
  const map = {}
  events.forEach((ev) => {
    const d = parseISODate(ev.start_time)
    const key = d.toDateString()
    map[key] = map[key] || []
    map[key].push(ev)
  })
  return map
}

export default function CalendarView({ events = [], onDateClick }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const byDay = useMemo(() => eventsByDay(events), [events])

  const days = datesForMonth(currentMonth)

  const prevMonth = () => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))
  }
  const nextMonth = () => {
    setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))
  }

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="cv-header">
        <div>
          <h2 className="cv-month-title">
            {currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </h2>
          <div className="cv-subtitle">{formatDateHuman(new Date())}</div>
        </div>
        <div className="cv-nav">
          <button onClick={prevMonth} className="cv-icon-btn" aria-label="Previous month">
            <ChevronLeft size={20} />
          </button>
          <button onClick={nextMonth} className="cv-icon-btn" aria-label="Next month">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="cv-surface">
        {/* Day Headers */}
        <div className="cv-day-headers">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d) => (
            <div key={d} className="cv-day-header">
              <span className="cv-day-label-lg">{d}</span>
              <span className="cv-day-label-sm">{d.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="cv-day-grid">
          {days.map((day) => {
            const key = day.toDateString()
            const evts = byDay[key] || []
            const isToday = isSameDay(day, new Date())
            
            return (
              <button
                key={key}
                onClick={() => onDateClick(day)}
                className={`cv-day ${isToday ? 'today' : ''}`}
              >
                <div className="cv-day-top">
                  <div className={`cv-day-number ${isToday ? 'cv-today' : ''}`}>
                    {day.getDate()}
                  </div>
                  <div className="cv-day-month">{day.toLocaleString(undefined, {month:'short'})}</div>
                </div>

                {/* Events */}
                <div className="cv-events">
                  {evts.slice(0, 2).map((e) => (
                    <div key={e.id} className={`evt-badge ${TYPE_COLORS[e.type] || 'type-general'}`} title={e.name}>
                      <span className="evt-text-lg">{e.name.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="evt-text-sm">{e.name.split(' ')[0]}</span>
                    </div>
                  ))}
                  {evts.length > 2 && (
                    <div className="evt-more">+{evts.length - 2} more</div>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}