import React, { useState } from 'react';
import './CheckInFeature.css';

const CheckInFeature = ({ events = [], isLoggedIn = false }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [checkInMessage, setCheckInMessage] = useState('');
  const [checkedInEvents, setCheckedInEvents] = useState([]);

  const handleEventSelect = (eventId) => {
    setSelectedEvent(eventId);
  };

  const handleCheckIn = (e) => {
    e.preventDefault();
    
    if (!selectedEvent || !isLoggedIn) return;
    
    // In a real implementation, this would call an API to check in to the event
    console.log('Checking in to event:', {
      eventId: selectedEvent,
      isAnonymous,
      message: checkInMessage
    });
    
    // Add to checked-in events
    setCheckedInEvents([...checkedInEvents, selectedEvent]);
    
    // Reset form
    setCheckInMessage('');
    setSelectedEvent(null);
  };

  // Find current event if one is selected
  const currentEvent = events.find(event => event.id === selectedEvent);

  return (
    <div className="checkin-container">
      <div className="checkin-header">
        <h2>Event Check-In</h2>
      </div>

      {!isLoggedIn ? (
        <div className="login-prompt">
          <p>Please log in to check in to events.</p>
          <button className="login-button">Log In</button>
        </div>
      ) : (
        <>
          <div className="events-list">
            <h3>Upcoming Events</h3>
            {events.length === 0 ? (
              <p className="no-events">No upcoming events at this time.</p>
            ) : (
              <div className="event-cards">
                {events.map(event => {
                  const isCheckedIn = checkedInEvents.includes(event.id);
                  return (
                    <div 
                      key={event.id} 
                      className={`event-card ${selectedEvent === event.id ? 'selected' : ''} ${isCheckedIn ? 'checked-in' : ''}`}
                      onClick={() => !isCheckedIn && handleEventSelect(event.id)}
                    >
                      <div className="event-date">
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <h4 className="event-title">{event.title}</h4>
                      <div className="event-location">{event.location}</div>
                      {isCheckedIn && (
                        <div className="checked-in-badge">✓ Checked In</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedEvent && (
            <div className="checkin-form-container">
              <h3>Check In to {currentEvent?.title}</h3>
              <form className="checkin-form" onSubmit={handleCheckIn}>
                <div className="form-group">
                  <label htmlFor="checkin-message">Message (Optional)</label>
                  <textarea
                    id="checkin-message"
                    value={checkInMessage}
                    onChange={(e) => setCheckInMessage(e.target.value)}
                    placeholder="Share a message with the event organizers..."
                  />
                </div>
                
                <div className="form-group checkbox">
                  <input
                    type="checkbox"
                    id="anonymous-checkin"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                  />
                  <label htmlFor="anonymous-checkin">Check in anonymously</label>
                </div>
                
                <div className="form-actions">
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => setSelectedEvent(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="checkin-button">
                    Check In
                  </button>
                </div>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CheckInFeature;
