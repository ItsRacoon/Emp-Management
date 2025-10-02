import React, { useState, useEffect } from 'react';

const AnnouncementsList = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // In a real application, make an API call here
        // Mock data for demonstration
        const mockAnnouncements = [
          {
            id: 1,
            title: 'Company Picnic This Weekend',
            category: 'Event',
            date: '2025-04-27',
            content: 'Join us for the annual company picnic this Saturday at Central Park. Food and refreshments will be provided.',
            important: true
          },
          {
            id: 2,
            title: 'New Healthcare Benefits',
            category: 'HR Update',
            date: '2025-04-25',
            content: 'Starting next month, we are enhancing our healthcare package. Please check your email for more details.',
            important: false
          },
          {
            id: 3,
            title: 'Q2 Review Schedule',
            category: 'Performance',
            date: '2025-04-20',
            content: 'The Q2 performance reviews will begin next week. Make sure to complete your self-assessment by Friday.',
            important: true
          }
        ];
        
        setAnnouncements(mockAnnouncements);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) {
    return <div className="loading-spinner-small"></div>;
  }

  return (
    <section className="announcements-section">
      <div className="section-header">
        <h2>Announcements</h2>
        <button>View All</button>
      </div>
      
      <div className="announcements-list">
        {announcements.map(announcement => (
          <div key={announcement.id} className={`announcement-card ${announcement.important ? 'important' : ''}`}>
            <div className="announcement-header">
              <h3>{announcement.title}</h3>
              <span className="category-badge">{announcement.category}</span>
            </div>
            <p className="announcement-date">
              {new Date(announcement.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
            </p>
            <p className="announcement-content">{announcement.content}</p>
            <div className="announcement-actions">
              <button className="btn-read-more">Read More</button>
              {announcement.important && <span className="important-badge">Important</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AnnouncementsList;