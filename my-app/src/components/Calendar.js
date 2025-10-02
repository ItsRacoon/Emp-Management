import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Calendar.css';

// Sample data for leave records and holidays
const SAMPLE_LEAVES = [
  { 
    id: 1, 
    type: 'Casual', 
    status: 'Approved', 
    reason: 'Family event', 
    startDate: new Date(2025, 3, 10), 
    endDate: new Date(2025, 3, 12),
    color: '#4318FF'
  },
  { 
    id: 2, 
    type: 'Sick', 
    status: 'Approved', 
    reason: 'Flu', 
    startDate: new Date(2025, 3, 18), 
    endDate: new Date(2025, 3, 19),
    color: '#FF5252'
  },
  { 
    id: 3, 
    type: 'Earned', 
    status: 'Pending', 
    reason: 'Vacation', 
    startDate: new Date(2025, 3, 25), 
    endDate: new Date(2025, 3, 30),
    color: '#FFB547'
  }
];

const SAMPLE_HOLIDAYS = [
  {
    id: 1,
    name: 'Labor Day',
    date: new Date(2025, 3, 1),
    color: '#05CD99'
  },
  {
    id: 2,
    name: 'National Holiday',
    date: new Date(2025, 3, 22),
    color: '#05CD99'
  }
];

const Calendar = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tooltipInfo, setTooltipInfo] = useState(null);
  const [leaveModalOpen, setLeaveModalOpen] = useState(false);
  const [newLeaveRequest, setNewLeaveRequest] = useState({
    type: 'Casual',
    startDate: new Date(),
    endDate: new Date(),
    reason: ''
  });
  const [leaves, setLeaves] = useState(SAMPLE_LEAVES);
  const [holidays, setHolidays] = useState(SAMPLE_HOLIDAYS);
  
  // Fetch user info similar to Dashboard component
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found: Redirecting to login');
          navigate('/login');
          return;
        }

        // Mock API call - in a real app, this would fetch from the backend
        setTimeout(() => {
          setUser({
            name: 'Sachika Yanamoto',
            role: 'UI Designer',
            email: 'sach@gmail.com',
            employeeId: 'EMP001',
          });
          setLoading(false);
        }, 500);
        
      } catch (error) {
        console.error('Error fetching user info:', error);
        setError('Error connecting to the server');
        setLoading(false);
      }
    };

    fetchUserInfo();
    // In a real app, you would also fetch leaves and holidays here
  }, [navigate]);

  const renderHeader = () => {
    const dateFormat = { month: 'long', year: 'numeric' };
    
    return (
      <div className="calendar-header">
        <div className="calendar-navigation">
          <button onClick={prevMonth}>
            <span className="nav-icon">◀</span>
          </button>
          <h2>{currentMonth.toLocaleDateString('en-US', dateFormat)}</h2>
          <button onClick={nextMonth}>
            <span className="nav-icon">▶</span>
          </button>
        </div>
        <button 
          className="new-leave-btn"
          onClick={() => setLeaveModalOpen(true)}
        >
          Request Leave
        </button>
      </div>
    );
  };

  const renderDays = () => {
    const days = [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 7; i++) {
      days.push(
        <div className="day-header" key={i}>
          {daysOfWeek[i]}
        </div>
      );
    }
    
    return <div className="days-row">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
    const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
    const startDate = new Date(monthStart);
    const endDate = new Date(monthEnd);
    
    // Adjust the start date to the previous Sunday
    startDate.setDate(startDate.getDate() - startDate.getDay());
    
    // Adjust the end date to the next Saturday
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));
    
    const rows = [];
    let days = [];
    let day = new Date(startDate);
    
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const cloneDay = new Date(day);
        
        // Find leaves for this day
        const matchingLeaves = leaves.filter(leave => 
          cloneDay >= leave.startDate && cloneDay <= leave.endDate
        );
        
        // Find holiday for this day
        const matchingHoliday = holidays.find(holiday => 
          holiday.date.getDate() === cloneDay.getDate() && 
          holiday.date.getMonth() === cloneDay.getMonth() && 
          holiday.date.getFullYear() === cloneDay.getFullYear()
        );
        
        const isCurrentMonth = cloneDay.getMonth() === currentMonth.getMonth();
        const isToday = cloneDay.toDateString() === new Date().toDateString();
        const isSelected = cloneDay.toDateString() === selectedDate.toDateString();
        
        days.push(
          <div 
            className={`calendar-cell ${!isCurrentMonth ? 'disabled' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
            key={cloneDay.toString()}
            onClick={() => onDateClick(cloneDay)}
            onMouseEnter={(e) => handleCellHover(e, cloneDay, matchingLeaves, matchingHoliday)}
            onMouseLeave={() => setTooltipInfo(null)}
          >
            <span className="date-number">{cloneDay.getDate()}</span>
            
            {/* Show leave indicators */}
            {matchingLeaves.length > 0 && (
              <div className="leave-indicators">
                {matchingLeaves.map((leave, index) => (
                  <div 
                    key={index} 
                    className="leave-dot"
                    style={{ backgroundColor: leave.color }}
                    title={leave.type}
                  ></div>
                ))}
              </div>
            )}
            
            {/* Show holiday indicator */}
            {matchingHoliday && (
              <div 
                className="holiday-indicator"
                style={{ backgroundColor: matchingHoliday.color }}
                title={matchingHoliday.name}
              ></div>
            )}
          </div>
        );
        
        day.setDate(day.getDate() + 1);
      }
      
      rows.push(
        <div className="calendar-row" key={day.toString()}>
          {days}
        </div>
      );
      days = [];
    }
    
    return <div className="calendar-body">{rows}</div>;
  };
  
  const renderLeaveModal = () => {
    if (!leaveModalOpen) return null;
    
    return (
      <div className="leave-modal-overlay">
        <div className="leave-modal">
          <div className="modal-header">
            <h2>Request Leave</h2>
            <button 
              className="close-modal"
              onClick={() => setLeaveModalOpen(false)}
            >
              ×
            </button>
          </div>
          
          <div className="modal-body">
            <div className="form-group">
              <label>Leave Type</label>
              <select 
                value={newLeaveRequest.type}
                onChange={(e) => setNewLeaveRequest({...newLeaveRequest, type: e.target.value})}
              >
                <option value="Casual">Casual Leave</option>
                <option value="Sick">Sick Leave</option>
                <option value="Earned">Earned Leave</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                value={newLeaveRequest.startDate.toISOString().substr(0, 10)}
                onChange={(e) => setNewLeaveRequest({
                  ...newLeaveRequest, 
                  startDate: new Date(e.target.value)
                })}
              />
            </div>
            
            <div className="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                value={newLeaveRequest.endDate.toISOString().substr(0, 10)}
                onChange={(e) => setNewLeaveRequest({
                  ...newLeaveRequest, 
                  endDate: new Date(e.target.value)
                })}
              />
            </div>
            
            <div className="form-group">
              <label>Reason</label>
              <textarea 
                value={newLeaveRequest.reason}
                onChange={(e) => setNewLeaveRequest({...newLeaveRequest, reason: e.target.value})}
                placeholder="Please provide a reason for your leave request"
              ></textarea>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              className="cancel-btn"
              onClick={() => setLeaveModalOpen(false)}
            >
              Cancel
            </button>
            <button 
              className="submit-btn"
              onClick={handleSubmitLeave}
            >
              Submit Request
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  const renderTooltip = () => {
    if (!tooltipInfo) return null;
    
    const { x, y, leaves, holiday } = tooltipInfo;
    
    return (
      <div 
        className="tooltip"
        style={{
          left: x + 10,
          top: y + 10
        }}
      >
        {holiday && (
          <div className="tooltip-holiday">
            <h4>{holiday.name}</h4>
            <p>National Holiday</p>
          </div>
        )}
        
        {leaves.map((leave, index) => (
          <div key={index} className="tooltip-leave">
            <div className="tooltip-header">
              <span 
                className="leave-color-dot"
                style={{ backgroundColor: leave.color }}
              ></span>
              <h4>{leave.type} Leave</h4>
            </div>
            <p><strong>Status:</strong> <span className={`status-${leave.status.toLowerCase()}`}>{leave.status}</span></p>
            <p><strong>Dates:</strong> {leave.startDate.toLocaleDateString()} - {leave.endDate.toLocaleDateString()}</p>
            <p><strong>Reason:</strong> {leave.reason}</p>
          </div>
        ))}
      </div>
    );
  };
  
  const onDateClick = (day) => {
    setSelectedDate(day);
  };
  
  const handleCellHover = (e, day, matchingLeaves, matchingHoliday) => {
    if (matchingLeaves.length > 0 || matchingHoliday) {
      setTooltipInfo({
        x: e.clientX,
        y: e.clientY,
        leaves: matchingLeaves,
        holiday: matchingHoliday
      });
    }
  };
  
  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const handleSubmitLeave = () => {
    // In a real app, you would send this to the server
    // For now, we'll just add it to the local state
    const newLeave = {
      id: leaves.length + 1,
      type: newLeaveRequest.type,
      status: 'Pending',
      reason: newLeaveRequest.reason,
      startDate: newLeaveRequest.startDate,
      endDate: newLeaveRequest.endDate,
      color: newLeaveRequest.type === 'Casual' ? '#4318FF' : 
              newLeaveRequest.type === 'Sick' ? '#FF5252' : '#FFB547'
    };
    
    setLeaves([...leaves, newLeave]);
    setLeaveModalOpen(false);
    setNewLeaveRequest({
      type: 'Casual',
      startDate: new Date(),
      endDate: new Date(),
      reason: ''
    });
  };
  
  const renderLeavesSummary = () => {
    // Group leaves by type
    const leavesByType = {
      'Casual': 0,
      'Sick': 0,
      'Earned': 0
    };
    
    leaves.forEach(leave => {
      // Calculate the number of days
      const diffTime = Math.abs(leave.endDate - leave.startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      leavesByType[leave.type] += diffDays;
    });
    
    return (
      <div className="leaves-summary">
        <h3>Leave Summary</h3>
        <div className="summary-grid">
          <div className="summary-item" style={{ borderColor: '#4318FF' }}>
            <h4>Casual Leave</h4>
            <div className="summary-details">
              <p>Used: {leavesByType['Casual']} days</p>
              <p>Available: {20 - leavesByType['Casual']} days</p>
            </div>
          </div>
          
          <div className="summary-item" style={{ borderColor: '#FF5252' }}>
            <h4>Sick Leave</h4>
            <div className="summary-details">
              <p>Used: {leavesByType['Sick']} days</p>
              <p>Available: {15 - leavesByType['Sick']} days</p>
            </div>
          </div>
          
          <div className="summary-item" style={{ borderColor: '#FFB547' }}>
            <h4>Earned Leave</h4>
            <div className="summary-details">
              <p>Used: {leavesByType['Earned']} days</p>
              <p>Available: {10 - leavesByType['Earned']} days</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const renderUpcomingLeaves = () => {
    const today = new Date();
    const upcomingLeaves = leaves
      .filter(leave => leave.startDate >= today)
      .sort((a, b) => a.startDate - b.startDate)
      .slice(0, 3);
    
    const upcomingHolidays = holidays
      .filter(holiday => holiday.date >= today)
      .sort((a, b) => a.date - b.date)
      .slice(0, 3);
    
    return (
      <div className="upcoming-leaves">
        <h3>Upcoming Leaves & Holidays</h3>
        
        {upcomingLeaves.length > 0 && (
          <div className="upcoming-section">
            <h4>Your Leaves</h4>
            {upcomingLeaves.map((leave, index) => (
              <div key={index} className="upcoming-item">
                <div 
                  className="leave-type-indicator"
                  style={{ backgroundColor: leave.color }}
                ></div>
                <div className="upcoming-details">
                  <h5>{leave.type} Leave</h5>
                  <p>{leave.startDate.toLocaleDateString()} - {leave.endDate.toLocaleDateString()}</p>
                  <p className={`status-badge status-${leave.status.toLowerCase()}`}>{leave.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {upcomingHolidays.length > 0 && (
          <div className="upcoming-section">
            <h4>Holidays</h4>
            {upcomingHolidays.map((holiday, index) => (
              <div key={index} className="upcoming-item">
                <div 
                  className="holiday-type-indicator"
                  style={{ backgroundColor: holiday.color }}
                ></div>
                <div className="upcoming-details">
                  <h5>{holiday.name}</h5>
                  <p>{holiday.date.toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading calendar...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Back to Login</button>
      </div>
    );
  }

  return (
    <div className="calendar-container">
      <div className="calendar-wrapper">
        <section className="calendar-section">
          {renderHeader()}
          {renderDays()}
          {renderCells()}
        </section>
        
        <div className="calendar-sidebar">
          {renderLeavesSummary()}
          {renderUpcomingLeaves()}
          
          <div className="legend">
            <h3>Categories</h3>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#4318FF' }}></div>
              <span>Casual Leave</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#FF5252' }}></div>
              <span>Sick Leave</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#FFB547' }}></div>
              <span>Earned Leave</span>
            </div>
            <div className="legend-item">
              <div className="legend-dot" style={{ backgroundColor: '#05CD99' }}></div>
              <span>Holiday</span>
            </div>
          </div>
        </div>
      </div>
      
      {renderLeaveModal()}
      {renderTooltip()}
    </div>
  );
};

export default Calendar;

