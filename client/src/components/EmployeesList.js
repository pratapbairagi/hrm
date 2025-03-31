import React, { useState, useEffect } from 'react';
import { getEmployees, deleteEmployee } from '../services/api';
import { Link } from 'react-router-dom';
// import { employees } from '../data/employees';
import { FaEdit } from 'react-icons/fa';  // Arrow icons for expand/collapse

import { deleteUserById, getAllUsers } from '../services/userService';
import { toast } from 'react-toastify';

const EmployeesList = () => {
  const [employeesList, setEmployeesList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
   async function getEmployeesFun (){
    const data = await getAllUsers()
    setEmployeesList(data?.users)
    }
    getEmployeesFun()
  }, []);

  const handleDelete = async (employeeId) => {
    // Simulating delete operation and removing the employee from UI
    setLoading(true);
    try {
      const data = await deleteUserById(employeeId);
      setLoading(false);
      setEmployeesList(data.users)
      toast.success("User deleted successfully !")
    } catch (error) {
      toast.error(error.message || 'Something went wrong during signup');
    }
  };

  return (
    <div className="employees-list max-h-screen overflow-auto relative">
      <div className="header sticky top-[-20px] right-7 flex items-center bg-white w-[100%] px-2 py-2" >
        <h2 className='left-1 mb-0'>Employees</h2>
        <Link to="/add-employee">
          <button className="add-employee-btn">Add Employee</button>
        </Link>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Department</th>
            <th>Role</th>
            <th>Joining Date</th>
            <th>Salary</th>
            <th>Week Off</th>
            <th>Pay Slip</th> {/* New column for Pay Slip */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employeesList?.map((employee) => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email}</td>
              <td>{employee.department}</td>
              <td>{employee.role}</td>
              <td>{new Date(employee.joining_date).toLocaleDateString()}</td>
              <td className=''>₹{employee.salary.toLocaleString()} <Link to={`/salary-slip/edit/${employee._id}`} className='text-xs w-max mx-auto'><FaEdit className=''/></Link> </td>
              <td> 
                {employee.weekoff.dates.map((v, i)=>{
                 return <span key={i} className='text-xs bg-red-500 text-gray-50 p-[2px] shadow-sm ml-[2px]'>{v.split("-")[2]}</span>
                })}
                <Link to={`/date-select/${employee._id}`} className='text-xs w-max mx-auto'><FaEdit className=''/></Link>
              </td>
              <td>
                {/* Link to the Pay Slip page */}
                <Link to={`/pay-slip/${employee._id}`}>
                  <button className="view-pay-slip-btn text-[10px]">Payslip</button>
                </Link>
              </td>
              <td>
                <Link to={`/employee/edit/${employee._id}`}>
                  <button className="edit-btn">Edit</button>
                </Link>
                <button disabled={loading} className="delete-btn" onClick={() => handleDelete(employee._id)}>
                  { loading ? "Loading..." : "Delete" }
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeesList;
