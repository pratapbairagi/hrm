// /src/components/AddEmployee.js
import React, { useState } from 'react';
import { addEmployee } from '../services/api';

const AddEmployee = () => {
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    hireDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Send employee data to the backend API
    addEmployee(employeeData)
      .then(() => alert('Employee added successfully!'))
      .catch((err) => console.error('Error adding employee:', err));
  };

  return (
    <div className="add-employee w-full">
      <h2>Add Employee</h2>
      <form  onSubmit={handleSubmit}>
        <label>Name</label>
        <input
          type="text"
          name="name"
          value={employeeData.name}
          onChange={handleChange}
          required
        />

        <label>Email</label>
        <input
          type="email"
          name="email"
          value={employeeData.email}
          onChange={handleChange}
          required
        />

        <label>Department</label>
        <input
          type="text"
          name="department"
          value={employeeData.department}
          onChange={handleChange}
          required
        />

        <label>Role</label>
        <input
          type="text"
          name="role"
          value={employeeData.role}
          onChange={handleChange}
          required
        />

        <label>Hire Date</label>
        <input
          type="date"
          name="hireDate"
          value={employeeData.hireDate}
          onChange={handleChange}
          required
        />

        <button type="submit">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployee;
