import React, { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { datesForMonth, isSameDay, formatDateHuman, parseISODate } from '../utils/dateUtils'

const TYPE_COLORS = {
  tech: 'bg-red-500',
  cultural: 'bg-blue-500',
  wellness: 'bg-green-500',
  general: 'bg-gray-800',
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            {currentMonth.toLocaleString(undefined, { month: 'long', year: 'numeric' })}
          </h2>
          <div className="text-sm text-gray-600 mt-1">{formatDateHuman(new Date())}</div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={prevMonth} 
            className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextMonth} 
            className="p-3 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Next month"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px bg-gray-200 border-b border-gray-200">
          {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((d, i) => (
            <div 
              key={d} 
              className="bg-white p-3 text-center"
            >
              <span className="hidden sm:inline text-sm font-semibold text-gray-700">{d}</span>
              <span className="sm:hidden text-xs font-semibold text-gray-700">{d.charAt(0)}</span>
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-px bg-gray-200">
          {days.map((day) => {
            const key = day.toDateString()
            const evts = byDay[key] || []
            const isToday = isSameDay(day, new Date())
            
            return (
              <button
                key={key}
                onClick={() => onDateClick(day)}
                className={`
                  bg-white p-2 sm:p-3 md:p-4 text-left 
                  hover:bg-purple-50 transition-colors
                  min-h-20 sm:min-h-24 md:min-h-32
                  ${isToday ? 'ring-2 ring-purple-600 ring-inset' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-1">
                  <div className={`
                    text-sm sm:text-base font-semibold
                    ${isToday ? 'text-purple-600' : 'text-gray-900'}
                  `}>
                    {day.getDate()}
                  </div>
                  <div className="hidden sm:block text-xs text-gray-400">
                    {day.toLocaleString(undefined, {month:'short'})}
                  </div>
                </div>
                
                {/* Events */}
                <div className="space-y-1">
                  {evts.slice(0, 2).map((e) => (
                    <div
                      key={e.id}
                      className={`
                        px-1.5 py-0.5 text-xs rounded text-white truncate
                        ${TYPE_COLORS[e.type] || 'bg-gray-500'}
                      `}
                      title={e.name}
                    >
                      <span className="hidden sm:inline">{e.name.split(' ').slice(0, 2).join(' ')}</span>
                      <span className="sm:hidden">{e.name.split(' ')[0]}</span>
                    </div>
                  ))}
                  {evts.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{evts.length - 2} more
                    </div>
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