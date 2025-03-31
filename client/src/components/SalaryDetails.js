// /src/components/SalaryDetails.js
import React, { useEffect, useState } from 'react';
import { getEmployees, generatePayroll } from '../services/api';

const SalaryDetails = () => {
  const [employees, setEmployees] = useState([]);
  const [payrollData, setPayrollData] = useState({
    month: '',
    baseSalary: 0,
    bonus: 0,
    deductions: 0,
    tax: 0,
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

  const handlePayroll = (id) => {
    generatePayroll(id, payrollData)
      .then(() => alert('Payroll generated successfully'))
      .catch(err => console.error('Error generating payroll:', err));
  };

  return (
    <div className="salary">
      <h2>Salary Details</h2>
      <div className="salary-list">
        {employees.map(employee => (
          <div key={employee._id} className="salary-item">
            <h3>{employee.firstName} {employee.lastName}</h3>
            <button onClick={() => handlePayroll(employee._id)}>Generate Payroll</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalaryDetails;
