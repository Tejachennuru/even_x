import React from 'react'
import { ChevronLeft, MapPin, Users, Phone, Mail, Clock, Calendar, DollarSign, Utensils, Zap, Wifi, Speaker } from 'lucide-react'
import './EventDetailsView.css'

const EVENT_TYPE_COLORS = {
  tech: { bgClass: 'type-tech', textClass: 'type-tech-text', badgeClass: 'type-tech-badge' },
  cultural: { bgClass: 'type-cultural', textClass: 'type-cultural-text', badgeClass: 'type-cultural-badge' },
  wellness: { bgClass: 'type-wellness', textClass: 'type-wellness-text', badgeClass: 'type-wellness-badge' },
  general: { bgClass: 'type-general', textClass: 'type-general-text', badgeClass: 'type-general-badge' },
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
    <div className="edv-container">
      {/* Header with Back Button */}
      <div className="edv-header">
        <button onClick={onBack} className="edv-back-btn">
          <ChevronLeft size={20} />
          <span className="edv-back-text">Back to Events</span>
        </button>
      </div>

      {/* Main Content Card */}
      <div className="edv-card">
        {/* Hero Image */}
        <div className="edv-hero">
          <img 
            src={event.poster_url} 
            alt={event.name} 
            className="edv-hero-img"
          />
          <div className="edv-hero-overlay"></div>

          {/* Event Type Badge */}
          <div className="edv-badge-wrap">
            <span className={`edv-badge ${typeColors.bgClass}`}>
              {event.type ? event.type.charAt(0).toUpperCase() + event.type.slice(1) : 'General'}
            </span>
          </div>

          {/* Title Overlay */}
          <div className="edv-title-wrap">
            <h1 className="edv-title">{event.name}</h1>
            <div className="edv-meta">
              <div className="edv-meta-item">
                <Calendar size={16} />
                <span>{new Date(event.start_time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
              <div className="edv-meta-item">
                <Clock size={16} />
                <span>
                  {new Date(event.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  {' - '}
                  {new Date(event.end_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="edv-grid">
          {/* Main Content - 2 columns */}
          <div className="edv-main">
            <section>
              <h2 className="edv-heading">About This Event</h2>
              <p className="edv-description break-words">{event.description}</p>
            </section>

            {/* Hospitality */}
            {event.hospitality && (Object.values(event.hospitality).some(val => val)) && (
              <section className="edv-hospitality">
                <h3 className="edv-subheading"><Utensils size={20} className="edv-accent" /> Hospitality Arrangements</h3>
                <div className="edv-hosp-grid">
                  {event.hospitality.chairs > 0 && (
                    <div className="edv-hosp-item">
                      <div className="edv-dot"></div>
                      <span><strong>{event.hospitality.chairs}</strong> Chairs</span>
                    </div>
                  )}
                  {event.hospitality.tables > 0 && (
                    <div className="edv-hosp-item">
                      <div className="edv-dot"></div>
                      <span><strong>{event.hospitality.tables}</strong> Tables</span>
                    </div>
                  )}
                  {event.hospitality.electricity && (
                    <div className="edv-hosp-item">
                      <Zap size={16} className="edv-accent" />
                      <span>Electricity Available</span>
                    </div>
                  )}
                  {event.hospitality.food && (
                    <div className="edv-hosp-item edv-hosp-full">
                      <Utensils size={16} className="edv-accent" />
                      <span>{event.hospitality.food}</span>
                    </div>
                  )}
                  {event.hospitality.others && (
                    <div className="edv-hosp-others">{event.hospitality.others}</div>
                  )}
                </div>
              </section>
            )}

            {/* Logistics */}
            {event.logistics && (Object.values(event.logistics).some(val => val)) && (
              <section className="edv-logistics">
                <h3 className="edv-subheading"><Speaker size={20} className="edv-accent" /> Logistics & Facilities</h3>
                <div className="edv-tags">
                  {event.logistics.sound && (
                    <div className="edv-tag"><Speaker size={16} className="edv-accent" /><span>Sound System</span></div>
                  )}
                  {event.logistics.wifi && (
                    <div className="edv-tag"><Wifi size={16} className="edv-accent" /><span>WiFi Available</span></div>
                  )}
                </div>
                {event.logistics.others && (
                  <div className="edv-logistics-others">{event.logistics.others}</div>
                )}
              </section>
            )}
          </div>

          {/* Sidebar - 1 column */}
          <aside className="edv-sidebar">
            <div className="edv-info-card">
              <h3 className="edv-info-heading">Event Details</h3>

              <div className="edv-info-row">
                <MapPin size={20} className="edv-accent" />
                <div>
                  <div className="edv-info-label">Venue</div>
                  <div className="edv-info-value break-words">{event.venue}</div>
                </div>
              </div>

              <div className="edv-info-row">
                <Users size={20} className="edv-accent" />
                <div>
                  <div className="edv-info-label">Expected Attendance</div>
                  <div className="edv-info-value">{event.footfall} people</div>
                </div>
              </div>

              <div className="edv-info-row">
                <DollarSign size={20} className="edv-accent" />
                <div>
                  <div className="edv-info-label">Tickets</div>
                  {event.ticket_available ? (
                    <div className="edv-ticket-prices">
                      <div>GITAM: <strong>₹{event.gitam_price}</strong></div>
                      <div>Others: <strong>₹{event.other_price}</strong></div>
                    </div>
                  ) : (
                    <div className="edv-free">Free Entry</div>
                  )}
                </div>
              </div>
            </div>

            <div className="edv-organizer-card">
              <h3 className="edv-info-heading">Contact Organizer</h3>

              <div className="edv-organizer">
                <div className="edv-avatar">{event.organizer_name?.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="edv-organizer-name">{event.organizer_name}</div>
                  <div className="edv-organizer-role">Event Organizer</div>
                </div>
              </div>

              <div className="edv-contact-list">
                <a href={`tel:${event.organizer_number}`} className="edv-contact-link">
                  <Phone size={16} />
                  <span>{event.organizer_number}</span>
                </a>
                <a href={`mailto:${event.organizer_email}`} className="edv-contact-link">
                  <Mail size={16} />
                  <span className="edv-contact-email break-words">{event.organizer_email}</span>
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}