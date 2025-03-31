// /src/components/AddEmployeeForm.js
import React, { useState } from 'react';
import { addEmployee } from '../services/api'; // API call to add an employee

const AddEmployeeForm = () => {
    const [employeeData, setEmployeeData] = useState({
        name: '',
        email: '',
        department: '',
        role: '',
        joiningDate: '',
        salary: '', // Added salary field
        password: '', // Added password field
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
    // Call API to add employee
    addEmployee(employeeData)
      .then((newEmployee) => {
        alert('Employee added successfully!');
        // Clear form fields after submission
        setEmployeeData({ name: '', email: '', department: '', role: '', hireDate: '' });
      })
      .catch((err) => console.error('Error adding employee:', err));
  };

  return (
    <div className="add-employee-form">
      <h2>Add New Employee</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Employee Name"
            value={employeeData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Employee Email"
            value={employeeData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="Employee Department"
            value={employeeData.department}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="role">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            placeholder="Employee Role"
            value={employeeData.role}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
  <label htmlFor="salary">Salary</label>
  <input
    type="number"
    id="salary"
    name="salary"
    placeholder="Employee Salary"
    value={employeeData.salary}
    onChange={handleChange}
    required
  />
</div>

<div className="form-group">
  <label htmlFor="password">Password</label>
  <input
    type="password"
    id="password"
    name="password"
    placeholder="Employee Password"
    value={employeeData.password}
    onChange={handleChange}
    required
  />
</div>

        <div className="form-group">
          <label htmlFor="hireDate">Hire Date</label>
          <input
            type="date"
            id="hireDate"
            name="hireDate"
            value={employeeData.hireDate}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Add Employee</button>
      </form>
    </div>
  );
};

export default AddEmployeeForm;
