// /src/components/EmployeeAttendance.js
import React, { useEffect, useState } from 'react';
import { getEmployees, updateAttendance } from '../services/api';

const EmployeeAttendance = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({
    date: new Date().toISOString().split('T')[0],
    status: 'Present',
    remarks: '',
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await getEmployees();
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  const handleAttendance = (id) => {
    updateAttendance(id, attendanceStatus)
      .then(() => alert('Attendance marked successfully'))
      .catch(err => console.error('Error marking attendance:', err));
  };

  return (
    <div className="attendance">
      <h2>Employee Attendance</h2>
      <div className="attendance-list">
        {employees.map(employee => (
          <div key={employee._id} className="attendance-item">
            <h3>{employee.firstName} {employee.lastName}</h3>
            <button onClick={() => handleAttendance(employee._id)}>Mark Attendance</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeAttendance;
