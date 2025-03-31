import React, { useState, useEffect } from 'react';

// Utility function to save attendance to localStorage
const saveAttendanceToStorage = (data) => {
  localStorage.setItem('attendanceData', JSON.stringify(data));
};

// Utility function to get attendance data from localStorage
const getAttendanceFromStorage = () => {
  const storedData = JSON.parse(localStorage.getItem('attendanceData'));
  return storedData ? storedData : {};
};

const AttendanceCalendar = ({ joinDate }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [markedDate, setMarkedDate] = useState(null);

  // Get the first day of the selected month and number of days in the month
  const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1);
  const lastDayOfMonth = new Date(selectedYear, selectedMonth + 1, 0);
  const numberOfDaysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // Day of the week for the 1st of the month

  // Use effect to initialize the attendance data
  useEffect(() => {
    const storedAttendance = getAttendanceFromStorage();
    let days = [];
    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      let status = '';
      const currentDay = new Date(selectedYear, selectedMonth, i);
      const dateKey = `${selectedYear}-${selectedMonth + 1}-${i}`; // Format the date to key for storage
      // Check if the attendance for this day is already stored
      if (storedAttendance[dateKey]) {
        status = storedAttendance[dateKey];
      } else if (currentDay < new Date()) {
        status = 'Present'; // Default to present for past days
      } else if (currentDay > new Date()) {
        status = 'Weekoff'; // Future days are marked as weekoff
      }
      const isToday = currentDay.toISOString().split('T')[0] === new Date().toISOString().split('T')[0];
      days.push({
        date: i,
        status,
        isToday,
        dayOfWeek: currentDay.getDay(),
        dateString: currentDay.toISOString().split('T')[0],
      });
    }
    setAttendanceData(days);
  }, [selectedMonth, selectedYear]);

  // Handle month and year change
  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-');
    setSelectedYear(parseInt(year, 10));
    setSelectedMonth(parseInt(month, 10));
  };

  // Handle marking attendance
  const handleMarkAttendance = (date) => {
    const updatedData = [...attendanceData];
    const currentDay = updatedData.find((day) => day.date === date);
    const prevDay = updatedData.find((day) => day.date === date - 1);

    if (date === new Date().getDate()) {
      // Mark today's attendance as Present
      setMarkedDate(date);
      currentDay.status = 'Present'; // Mark today as present

      // Check if previous day is absent and mark it as absent if not already marked
      if (prevDay && prevDay.status !== 'Present' && prevDay.status !== 'Leave') {
        prevDay.status = 'Absent';
      }

      // Save the updated attendance to localStorage
      const storedAttendance = getAttendanceFromStorage();
      const dateKey = `${selectedYear}-${selectedMonth + 1}-${date}`;
      storedAttendance[dateKey] = 'Present';
      saveAttendanceToStorage(storedAttendance);
    }
    setAttendanceData(updatedData);
  };

  // Generate the calendar days
  const renderCalendar = () => {
    const calendarDays = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Display calendar days
    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      const day = attendanceData.find((record) => record.date === i);
      calendarDays.push(
        <div
          key={i}
          className={`calendar-day ${day?.isToday ? 'today' : ''} ${day?.status === 'Present' ? 'present' : ''} 
          ${day?.status === 'Absent' ? 'absent' : ''} ${day?.status === 'Weekoff' ? 'weekoff' : ''}`}
          onClick={() => day.status !== 'Weekoff' && handleMarkAttendance(i)}
        >
          <div className="day-number">{i}</div>
          <div className="day-status">{day?.status}</div>
        </div>
      );
    }

    return calendarDays;
  };

  return (
    <div className="attendance-calendar">
      <div className="month-year-selector">
        <select onChange={handleMonthChange} value={`${selectedYear}-${selectedMonth + 1}`}>
          {/* Generate options for months and years */}
          {Array.from({ length: 12 }).map((_, index) => {
            const date = new Date(selectedYear, index);
            return (
              <option key={index} value={`${date.getFullYear()}-${date.getMonth() + 1}`}>
                {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
              </option>
            );
          })}
        </select>
      </div>

      <div className="calendar">
        <div className="calendar-header">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="calendar-day-header">{day}</div>
          ))}
        </div>

        <div className="calendar-body">{renderCalendar()}</div>
      </div>

      <div className="status-message">
        {markedDate ? (
          <span>Attendance for {markedDate} has been marked as Present.</span>
        ) : (
          <span>Please mark today's attendance.</span>
        )}
      </div>
    </div>
  );
};

export default AttendanceCalendar;
