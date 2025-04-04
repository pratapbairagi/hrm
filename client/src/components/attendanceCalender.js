import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { attendanceUpdateRequest } from "../services/attendanceService";

const AttendanceCalendar = ({ userId }) => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth()); // Start with current month
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear()); // Start with current year
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');

  // State for Popup Form
  const [showPopup, setShowPopup] = useState(false);
  const [attendanceRequest, setAttendanceRequest] = useState({
    status: "Absent",
    overTime: 0
  });

  // Generate a list of years for selection
  const generateYears = () => {
    const years = [];
    const currentYear = new Date().getFullYear();
    for (let i = currentYear; i >= 2000; i--) {
      years.push(i);
    }
    return years;
  };

  // Generate a list of months for selection
  const generateMonths = () => {
    return [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
  };

  // Normalize date to YYYY-MM-DD format for comparison
  const normalizeDate = (date) => {
    const d = new Date(date);
    return d.toISOString().split('T')[0];  // Format as YYYY-MM-DD
  };

  // Fetch attendance data for the selected month and year
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        // const response = await axios.get(`http://localhost:5000/api/attendance/getMonthlyAttendance/${userId}/${selectedYear}/${selectedMonth + 1}`);
        const response = await axios.get(`https://kms-hrm.vercel.app/api/attendance/getMonthlyAttendance/${userId}/${selectedYear}/${selectedMonth + 1}`);

        // Normalize backend data to match the correct date format
        const normalizedAttendance = response.data.attendance.map(day => ({
          ...day,
          date: normalizeDate(day.date),  // Normalize each date
        }));
        setAttendanceData(normalizedAttendance); // Ensure attendanceData is always an array
      } catch (error) {
        console.error('Error fetching attendance data', error);
        setAttendanceData([]); // Default to empty array if there is an error
      }
    };

    fetchAttendanceData();
  }, [selectedMonth, selectedYear, userId]);

  const handleMarkAttendance = async (date) => {
    setLoading(true);
    const updatedData = [...attendanceData];

    // Normalize the current date to string format (YYYY-MM-DD) for comparison
    const currentDateStr = normalizeDate(new Date(selectedYear, selectedMonth, date));

    // Find today's attendance in the updated data
    const currentDay = updatedData.find(day => day.date === currentDateStr);

    // If attendance already exists, update the status
    if (currentDay) {
      currentDay.status = 'Present';
    } else {
      // If no attendance exists, add a new entry
      updatedData.push({
        date: currentDateStr,
        status: 'Present',
      });
    }

    setAttendanceData(updatedData); // Update state with the new data

    // Make an API request to mark attendance in the backend
    try {
      // const response = await axios.post('http://localhost:5000/api/attendance/markAttendance', {
        const response = await axios.post('https://kms-hrm.vercel.app/api/attendance/markAttendance', {
        employeeId: userId,
        status: 'Present',
        checkInTime: new Date(),
      });
      setLoading(false);
      toast.success('Attendance Marked!');
    } catch (error) {
      setLoading(false);
      toast.error('Unable to Mark Attendance!');
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();

    // Generate the array of all days in the month
    const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
      const dayOfMonth = i + 1;  // Day of the month (1 to daysInMonth)
      return {
        index: dayOfMonth,
        date: `${selectedYear}-${(selectedMonth + 1).toString().padStart(2, '0')}-${dayOfMonth.toString().padStart(2, '0')}`
      };
    });

    // Now, match the attendance data with the days
    const days = daysArray.map((d) => {
      // Find attendance data for the current day (if it exists)
      // const attendance = attendanceData.find((v) => v.date === d.date); // object based
      const attendance = attendanceData.filter((v) => v.date === d.date); // array based - if the same date has two status like weekoff and present

      // If attendance exists, merge it with the day data
      console.log("array attend ", attendance)
      // if (attendance) {
      if (attendance.length > 0) {

        return { ...d, status: attendance.map(v => v.status), _id: attendance.map(v => v._id) };
      } else {
        // Otherwise, set status to "Not marked"
        return { ...d, status: ["Not marked"], _id: [null] };
      }
    });

    return days.filter((val, ind, self) =>
      ind === self.findIndex(sel => sel.status === val.status)
    );
  };

  // Handle the attendance update or overtime request
  const handleSubmitRequest = async () => {
    // Handle the request submission (you can send this data to your backend if necessary)
    const response = await attendanceUpdateRequest({ userId, date: selectedDate, data: attendanceRequest });

    if (response.success) {
      toast.success(response.message);
      setShowPopup(false);  // Close the popup after submission
    }

  };

  // Get the day of the week (0 for Sunday, 1 for Monday, etc.)
  const getDayOfWeek = (date) => {
    const d = new Date(date);
    return d.getDay();
  };

  const Datessss = useMemo(() => {
    let dts = [ 1 ,2 ,3 ,4 ,5 ,6 ,7 ];

    const crrctDys = dts.map((v,i)=>{
      const dt = new Date(`${selectedYear}-${selectedMonth + 1}-${v.toString().padStart(2, "0")}`).toString().split(" ")[0]
      return dt
    })

    return crrctDys

  }, [selectedYear, selectedMonth])



  console.log("attendanceData ", Datessss)
  return (
    <div className="attendance-calendar max-w-4xl mx-auto p-4">
      {/* <h2 className="text-xl font-bold text-center text-blue-600 mb-4">Attendance for {generateMonths()[selectedMonth]} {selectedYear}</h2> */}

      {/* Dropdown for Year Selection */}
      <div className="flex justify-center space-x-2 mb-2">
        <div className="flex flex-col">
          <label htmlFor="year" className="text-md font-medium">Select Year</label>
          <select
            id="year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="mt-2 p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {generateYears().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Dropdown for Month Selection */}
        <div className="flex flex-col">
          <label htmlFor="month" className="text-md font-medium">Select Month</label>
          <select
            id="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="mt-2 p-2 text-sm rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {generateMonths().map((month, index) => (
              <option key={index} value={index}>{month}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Render Calendar */}
      <div className="calendar mb-4">
        {/* Days of the Week Header */}
        <div className="calendar-header grid grid-cols-7 gap-1 mb-2">
          {Datessss.map((day, index) => {
           return <div key={index} className="text-center font-semibold">{day}</div>
})}
        </div>

        {/* Render Dates */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar().map((v, i) => (
            <div
              key={i}
              className="calendar-day flex flex-col items-center justify-center p-[10px] bg-white shadow-md rounded-lg hover:bg-blue-100 cursor-pointer relative"
            >
              <div className="text-sm font-semibold w-[90%] mx-auto gap-x-[6px] flex justify-center items-center">
                <span className='px-[8px] py-[3px] bg-orange-400 rounded-[3px] text-gray-50'>{i + 1}</span>
                <button
                  className='px-[8px] py-[3px] bg-orange-400 rounded-[3px] text-gray-50'
                  onClick={() => {
                    setSelectedDate(v.date);  // Set the selected date
                    setShowPopup(true);  // Show the popup form
                  }}
                >
                  +
                </button>
              </div>
              {/* <div className={`text-[9px] mt-1 ${v.status === 'Present' ? 'text-green-500' : v.status === 'Weekoff' ? 'text-orange-500 font-bold' : v.status === 'Holiday' ? 'text-orange-700 font-bold' : v.status === 'Absent' ? 'text-red-500' : v.status === 'Leave' ? 'text-yellow-500' : "text-gray-500"}`}> */}
              <div className={`text-[10px] mt-1 `}>
                {/* {v.status} */}
                {
                  [...new Set(v.status)].map((st, sti) => {
                    { console.log("status ", st) }

                    return <span key={sti} className={`${st === 'Present' ? 'text-green-500' : st === 'Weekoff' ? 'text-orange-500 font-bold' : st === 'Holiday' ? 'text-orange-700 font-bold' : st === 'Absent' ? 'text-red-500' : st === 'Leave' ? 'text-yellow-500' : "text-gray-500"}`} >{st} {[...new Set(v.status)].length > 1 ? " / " : ""}</span>
                  })
                }

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Button to Mark Today's Attendance */}
      <div className="flex justify-center">
        <button
          onClick={() => handleMarkAttendance(new Date().getDate())}
          className="px-3 py-2 bg-blue-600 text-sm text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
        >
          Mark Today's Attendance
        </button>
      </div>

      {/* Popup Form for Attendance Update / Overtime Request */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="text-xl font-semibold text-center">Request Attendance / Overtime</h3>
            <div className="mt-4">
              <label htmlFor="attendanceRequest" className="block text-sm font-medium">Attendance Request</label>
              <select
                id="attendanceRequest"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={attendanceRequest.status}
                onChange={(e) => setAttendanceRequest(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="Leave">Leave</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Weekoff">Weekoff</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="overtimeRequest" className="block text-sm font-medium">Overtime Request</label>
              <input
                id="overtimeRequest"
                value={attendanceRequest.overTime}
                onChange={(e) => setAttendanceRequest(prev => ({ ...prev, overTime: e.target.value }))}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                type='number'
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => handleSubmitRequest()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="ml-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceCalendar;
