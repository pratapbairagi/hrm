// /src/components/AddEmployeeForm.js
import React, { useEffect, useState } from 'react';
import { addEmployee } from '../services/api'; // API call to add an employee
import { employees } from "../data/employees"
import { useParams } from 'react-router';
import { getUserById, updateUser } from '../services/userService';
import { toast } from 'react-toastify';

const EditEmployeeForm = () => {

  const { id } = useParams()
  console.log("employess ", id)
  const [employeeData, setEmployeeData] = useState({
    name: '',
    email: '',
    department: '',
    role: '',
    joining_date: '',
    contact: 0,
    address: '',
    // about: '',
    position : "",
    salary: '', // Added salary field
    password: '', // Added password field
  });
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchEmployee() {
      const data = await getUserById(id)
      setEmployeeData(data?.user)
    }

    fetchEmployee()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      const data = await updateUser(id, employeeData);
      toast.success('Profile updated successfully !');
      setLoading(false);

    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Something went wrong during signup');
    }

  };


  return (
    <div className=" h-max w-[70%] mx-auto my-2 shadow-md p-6 rounded-md bg-white">
      <h2 className='text-md'>Edit Profile</h2>
      <div className='w-full flex flex-wrap justify-between gap-3' onSubmit={handleSubmit}>
        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="name" className='text-sm lg:text-xs'>Name</label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Employee Name"
            value={employeeData.name}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="email" className='text-sm lg:text-xs'>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Employee Email"
            value={employeeData.email}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="contact" className='text-sm lg:text-xs'>Contact</label>
          <input
            type="number"
            id="contact"
            name="contact"
            placeholder="Contact Number..."
            value={employeeData.contact}
            onChange={handleChange}
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="department" className='text-sm lg:text-xs'>Department</label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="Employee Department"
            value={employeeData.department}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="department" className='text-sm lg:text-xs'>Position</label>
          <input
            type="text"
            id="position"
            name="position"
            placeholder="Employee Position"
            value={employeeData.position}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="role" className='text-sm lg:text-xs'>Role</label>
          {/* <input
            type="text"
            id="role"
            name="role"
            placeholder="Employee Role"
            value={employeeData.role}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          /> */}
          <select
            id='role'
            className='text-sm lg:text-xs min-h-[2.5rem]'
            name='role' onChange={handleChange}
          >
            <option value="employee">Employee</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="salary" className='text-sm lg:text-xs'>Salary</label>
          <input
            type="number"
            id="salary"
            name="salary"
            placeholder="Employee Salary"
            value={employeeData.salary}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="password" className='text-sm lg:text-xs'>Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Employee Password"
            value={employeeData.password}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          />
        </div>
        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="password" className='text-sm lg:text-xs'>Address</label>
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Enter Address"
            value={employeeData.address}
            onChange={handleChange}
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group">
          <label htmlFor="hireDate" className='text-sm lg:text-xs'>Hire Date</label>
          <input
            type="date"
            id="hireDate"
            name="joining_date"
            value={employeeData.joining_date}
            onChange={handleChange}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <button
          onClick={handleSubmit}
          className="submit-btn w-full"
          disabled={loading}
        >
          {loading ? 'Processing...' : "Update Profile"}
        </button>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
