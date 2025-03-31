import React, { useState, useEffect } from 'react';

const ViewAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Default to current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Default to current year
  const [markedDate, setMarkedDate] = useState(null);

  // Get the current month and year
  const currentMonth = selectedMonth;
  const currentYear = selectedYear;

  // Get the first day of the month and number of days in the month
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
  const numberOfDaysInMonth = lastDayOfMonth.getDate();
  const startDayOfWeek = firstDayOfMonth.getDay(); // Day of week for the 1st of the month

  // Function to fetch attendance data from localStorage
  const getAttendanceFromStorage = () => {
    const storedData = JSON.parse(localStorage.getItem('attendanceData'));
    return storedData ? storedData : {};
  };

  // Save attendance data to localStorage
  const saveAttendanceToStorage = (data) => {
    localStorage.setItem('attendanceData', JSON.stringify(data));
  };

  // Generate an array representing the days in the month
  useEffect(() => {
    const storedAttendance = getAttendanceFromStorage();
    let days = [];
    for (let i = 1; i <= numberOfDaysInMonth; i++) {
      let status = '';
      const currentDay = new Date(currentYear, currentMonth, i);
      const dateKey = `${currentYear}-${currentMonth + 1}-${i}`; // Format the date to key for storage
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
  }, [currentMonth, currentYear]);

  const handleMarkAttendance = (date) => {
    const updatedData = [...attendanceData];
    const currentDay = updatedData.find(day => day.date === date);
    const prevDay = updatedData.find(day => day.date === date - 1);

    if (date === new Date().getDate()) {
      if (prevDay && prevDay.status !== 'Present' && prevDay.status !== 'Leave') {
        prevDay.status = 'Leave'; // Mark previous day as Leave if not present
      }

      setMarkedDate(date);
      currentDay.status = 'Present'; // Mark today's attendance as Present

      // Save the updated attendance to localStorage
      const storedAttendance = getAttendanceFromStorage();
      const dateKey = `${currentYear}-${currentMonth + 1}-${date}`;
      storedAttendance[dateKey] = 'Present';
      saveAttendanceToStorage(storedAttendance);
    }
    setAttendanceData(updatedData);
  };

  // Function to handle month change
  const handleMonthChange = (event) => {
    const [year, month] = event.target.value.split('-');
    setSelectedYear(parseInt(year, 10));
    setSelectedMonth(parseInt(month, 10));
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-gray-700 mb-6">
          Mark Attendance for {new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}
        </h2>

        {/* Month and Year Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">Select Month</label>
          <select
            onChange={handleMonthChange}
            value={`${selectedYear}-${selectedMonth + 1}`} // Format to match 'YYYY-MM'
            className="mt-2 p-2 border border-gray-300 rounded w-full sm:w-1/2 mx-auto"
          >
            {/* Generate options for last 12 months */}
            {Array.from({ length: 12 }).map((_, index) => {
              const date = new Date(currentYear, index);
              return (
                <option key={index} value={`${date.getFullYear()}-${date.getMonth() + 1}`}>
                  {date.toLocaleString('default', { month: 'long' })} {date.getFullYear()}
                </option>
              );
            })}
          </select>
        </div>

        {/* Attendance Calendar */}
        <div className="grid grid-cols-7 gap-4 mb-6">
          {/* Days of the Week */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
            <div key={index} className="text-center text-gray-600 font-medium">{day}</div>
          ))}

          {/* Empty Cells for the Days Before the First Day of the Month */}
          {Array.from({ length: startDayOfWeek }).map((_, index) => (
            <div key={index} className="text-center text-gray-300"> </div>
          ))}

          {/* Calendar Days */}
          {attendanceData.map((day) => (
            <div
              key={day.date}
              className={`relative flex flex-col items-center justify-center p-4 rounded-lg transition-colors 
                ${day.isToday ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-800'} 
                ${day.status === 'Present' ? 'bg-green-200' : ''} 
                ${day.status === 'Weekoff' ? 'bg-gray-300' : ''} 
                ${day.status === 'Leave' ? 'bg-yellow-200' : ''} 
                cursor-pointer hover:bg-indigo-100`}
              onClick={() => day.status !== 'Weekoff' && handleMarkAttendance(day.date)}
            >
              <span className="text-lg font-semibold">{day.date}</span>
              {day.status && (
                <span className="absolute bottom-2 text-xs text-gray-500">{day.status}</span>
              )}
              {day.isToday && !day.status && (
                <span className="absolute bottom-2 text-xs text-white font-semibold">Today</span>
              )}
            </div>
          ))}
        </div>

        {/* Marked Attendance */}
        <div className="mt-6 text-center">
          {markedDate ? (
            <span className="text-green-500">Attendance for {markedDate} has been marked as Present.</span>
          ) : (
            <span className="text-red-500">Please mark today's attendance.</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewAttendance;
