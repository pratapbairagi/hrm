import React, { useState, useEffect } from 'react';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';  // Arrow icons for expand/collapse
import { getTodayAttendance } from "../services/attendanceService"

const AttendanceStatus = () => {
  const [employees, setEmployees] = useState(null);
  const [showAttended, setShowAttended] = useState(false);
  const [showAbsent, setShowAbsent] = useState(false);
  const [showLeave, setShowLeave] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getTodayAttendance(); // not able to import this fun from api service file
      setEmployees(data)
    };

    fetchData();
  }, []);

  // Toggle expand/collapse
  const toggleShowAttended = () => setShowAttended(!showAttended);
  const toggleShowAbsent = () => setShowAbsent(!showAbsent);
  const toggleShowLeave = () => setShowLeave(!showLeave);

  // console.log("attendance data ", data)

  return (
    <div className="w-full max-w-3xl p-6 mx-auto space-y-6">
      {/* Card for Attended Employees */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-gray-700">Employees Attended Today</h3>
            <p className="text-lg font-medium text-green-600">{employees?.present?.length || 0}</p>
          </div>
          <button onClick={toggleShowAttended}>
            {showAttended ? <FaArrowUp className="text-gray-500" /> : <FaArrowDown className="text-gray-500" />}
          </button>
        </div>

        {showAttended && (
          <div className="mt-4">
            <ul>
              {employees !== null && employees?.present?.map((emp) => {
                return <li key={emp._id} className="py-2 border-b border-gray-200">
                  {console.log(emp.employeeId)}
                  <p className="font-semibold">{emp?.employeeName || emp.employeeId}</p>
                  <p className="text-sm text-gray-500">Status: Attended</p>
                </li>
              })
            }
            </ul>
          </div>
        )}
      </div>

      {/* Card for Absent Employees */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-gray-700">Employees Absent Today</h3>
            <p className="text-lg font-medium text-red-600">{employees?.absent?.length || 0}</p>
          </div>
          <button onClick={toggleShowAbsent}>
            {showAbsent ? <FaArrowUp className="text-gray-500" /> : <FaArrowDown className="text-gray-500" />}
          </button>
        </div>

        {showAbsent && (
          <div className="mt-4">
            <ul>
              {employees !== null && employees?.absent?.map((emp) => {
                return <li key={emp._id} className="py-2 border-b border-gray-200">
                  <p className="font-semibold">{emp?.employeeName || emp.employeeId}</p>
                  <p className="text-sm text-gray-500">Status: Absent</p>
                </li>
              })}
            </ul>
          </div>
        )}
      </div>

      {/* Card for Leave Employees */}
      <div className="bg-white shadow-lg rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <h3 className="text-xl font-semibold text-gray-700">Employees on Leave Today</h3>
            <p className="text-lg font-medium text-blue-600">{employees?.leave?.length || 0}</p>
          </div>
          <button onClick={toggleShowLeave}>
            {showLeave ? <FaArrowUp className="text-gray-500" /> : <FaArrowDown className="text-gray-500" />}
          </button>
        </div>

        {showLeave && (
          <div className="mt-4">
            <ul>
              {employees !== null && employees?.leave?.map((emp) => {
                return <li key={emp._id} className="py-2 border-b border-gray-200">
                  <p className="font-semibold">{emp?.employeeName || emp.employeeId}</p>
                  <p className="text-sm text-gray-500">Status: On Leave</p>
                </li>
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceStatus;
