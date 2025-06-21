import React, { useState } from 'react';
import axios from 'axios';
import { setWeekoff } from '../services/salaryService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router';
import { FaCheckCircle } from 'react-icons/fa';

const DateSelector = ({ userId }) => {
  const [selectedDates, setSelectedDates] = useState([]);
  const [loading, setLoading] = useState(false);
  const {employeeId} = useParams()

  // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
  const getDayOfWeek = (date) => {
    const d = new Date(date);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return daysOfWeek[d.getDay()];
  };

  // Generate the calendar for the selected month and year
  const generateCalendar = (year, month) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const calendarDays = [];
    
    // Add empty days for the previous month's days
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarDays.push(null);
    }
    
    // Add the actual days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const currentDate = new Date(year, month, i);
      calendarDays.push({
        date: currentDate,
        dayOfWeek: getDayOfWeek(currentDate),
      });
    }
    
    return calendarDays;
  };

  // Handle the selection of a date
  const handleDateSelect = (day) => {
    // Get the local date components
    const localDate = new Date(day.date);
    const dateStr = `${localDate.getFullYear()}-${(localDate.getMonth() + 1).toString().padStart(2, '0')}-${localDate.getDate().toString().padStart(2, '0')}`;
    
    const alreadySelected = selectedDates.some(d => d.date === dateStr);
    
    if (selectedDates.length < 5 && !alreadySelected) {
      setSelectedDates([...selectedDates, {
        date: dateStr,
        dayOfWeek: day.dayOfWeek,
      }]);
    }
    else if(alreadySelected){
        setSelectedDates(selectedDates.filter(v=> v.date !== dateStr))
    }
  };
  
  
  

  // Handle the submit of selected dates to the backend
  const handleSubmit = async () => {
    if (selectedDates.length === 4 || selectedDates.length === 5) {
      setLoading(true);
      try {
        // const response = await axios.post('http://localhost:5000/api/attendance/submitSelectedDates', {
        //   userId,
        //   selectedDates: selectedDates.map(d => ({
        //     date: d.date,
        //     day: d.dayOfWeek,
        //   })),
        // });

        let selectedDate = selectedDates.map(d => ({
                date: d.date,
                day: d.dayOfWeek,
              }))

       const response = await setWeekoff(employeeId, selectedDate)
        setLoading(false);
        toast.success('Week Off set successfully !')
      } catch (error) {
        console.log("Error updating weekoff ! ", error)
        setLoading(false);
        // alert('Error submitting dates');
        toast.error('Error updating weekoff !')
      }
    } else {
      alert('Please select exactly 4 dates.');
    }
  };

  // Get the current month and year
  const today = new Date();
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth());
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());

  const calendarDays = generateCalendar(selectedYear, selectedMonth);

  return (
    <div className="date-selector max-w-[700px] mx-auto p-4">
      <h2 className="text-xl font-bold text-center mb-4">Select 4 or 5 Dates</h2>

      {/* Month and Year Selector */}
      <div className="flex justify-center space-x-2 mb-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg"
        >
          {Array.from({ length: 10 }, (_, i) => selectedYear - 5 + i).map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          className="p-2 border border-gray-300 rounded-lg"
        >
          {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Grid */}
      <div className="calendar grid grid-cols-7 gap-1 mb-4">
  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
    <div key={index} className="text-center font-semibold">{day}</div>
  ))}
  
  {calendarDays.map((day, index) => {
    const formattedDate = `${day.date.getFullYear()}-${(day.date.getMonth() + 1).toString().padStart(2, '0')}-${day.date.getDate().toString().padStart(2, '0')}`;
    
    return (
      <div
        key={index}
        className={`text-center cursor-pointer p-2 ${day ? 'bg-white' : 'bg-transparent'} w-[46px] h-[46px] flex justify-center items-center p-[12px] relative z-10`}
        onClick={() => day && handleDateSelect(day)}
      >
        {day ? (
          <>
            <div>{day.date.getDate()}</div>
            {selectedDates.find(d => d.date === formattedDate) && (
              <div className="text-xs font-bold text-green-500 absolute z-10 top-1 right-1"> <FaCheckCircle/> </div>
            )}
          </>
        ) : (
          <div>&nbsp;</div>
        )}
      </div>
    );
  })}
</div>


      {/* Display Selected Dates */}
      <div className="mb-4">
        <h3 className="font-semibold">Selected Dates:</h3>
        <ul className='flex flex-wrap justify-start gap-2 w-full max-w-[360px]'>
          {selectedDates.map((date, index) => (
            <li key={index} className='text-xs px-2 py-1 shadow-md rounded-[6px]'>
              {date.date.split("-")[2]} - {date.dayOfWeek}
            </li>
          ))}
        </ul>
      </div>

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-400"
          disabled={selectedDates.length < 4 || selectedDates.length > 5 || loading}
        >
          {loading ? 'Submitting...' : 'Submit Dates'}
        </button>
      </div>
    </div>
  );
};

export default DateSelector;
