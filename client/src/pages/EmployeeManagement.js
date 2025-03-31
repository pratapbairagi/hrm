import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EmployeeManagement = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState({ date: '', status: 'Present', remarks: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/employees')
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error('Error fetching employees:', err));
  }, []);

  const handleAttendance = (empId) => {
    axios.post(`http://localhost:5000/api/employees/attendance/${empId}`, attendance)
      .then(() => alert('Attendance updated'))
      .catch((err) => console.error('Error updating attendance:', err));
  };

  return (
    <div>
      <h2>Employee Management</h2>
      {employees.map((employee) => (
        <div key={employee._id}>
          <h3>{employee.firstName} {employee.lastName}</h3>
          <button onClick={() => handleAttendance(employee._id)}>Mark Attendance</button>
        </div>
      ))}
    </div>
  );
};

export default EmployeeManagement;
