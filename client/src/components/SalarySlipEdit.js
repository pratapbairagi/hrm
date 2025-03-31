// /src/components/AddEmployeeForm.js
import React, { useEffect, useState } from 'react';
import { addEmployee } from '../services/api'; // API call to add an employee
import { employees } from "../data/employees"
import { useParams } from 'react-router';
import { getUserById, updateUser } from '../services/userService';
import { toast } from 'react-toastify';
import { getDetailedSlip } from '../services/salaryService';

const EditSalarySlip = () => {

  const { id } = useParams()
  console.log("employess ", id)
  const [salarySlipData, setSalarySlipData] = useState({
    salaryComponents: {
        HRA : 0,
        DA : 0,
        TA : 0
    }
  });
  const [loading, setLoading] = useState(false)

 async function getCurrentMonth(){
    let date = new Date();
    let yr = date.getFullYear();
    let mnt = ( date.getMonth() + 1 ).toString().padStart(2, "0")

    const formattedDate = `${yr}-${mnt}`;

    return formattedDate
  }

  useEffect(() => {
    async function fetchEmployee() {
    //   const data = await getUserById(id)
    let currentMonth = await getCurrentMonth()
    console.log("current month ", currentMonth)
   const data = await getDetailedSlip(id, currentMonth)
   console.log("data salary slip ", data)
    //   setSalarySlipData(data?.user)
    }

    fetchEmployee()
  }, [id])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSalarySlipData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
   
    try {
      const data = await updateUser(id, salarySlipData);
      toast.success('Profile updated successfully !');
      setLoading(false);

    } catch (error) {
      setLoading(false);
      toast.error(error.message || 'Something went wrong during signup');
    }

  };


  return (
    <div className=" h-max w-[70%] mx-auto my-2 shadow-md p-6 rounded-md bg-white">
      <h2 className='text-md'>Edit Salary Slip</h2>
      <div className='w-full flex flex-wrap justify-between gap-3' onSubmit={handleSubmit}>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="email" className='text-sm lg:text-xs'>Basic Pay</label>
          <input
            type="number"
            id="baseSalary"
            name="baseSalary"
            placeholder="Basic Salary"
            value={salarySlipData.salaryComponents.baseSalary}
            onChange={(e)=> setSalarySlipData((prev)=> ({...prev, salaryComponents : { ...prev.salaryComponents, baseSalary : e.target.value }}))}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="contact" className='text-sm lg:text-xs'>HRA</label>
          <input
            type="number"
            id="HRA"
            name="HRA"
            placeholder="House Rent Allowance..."
            value={salarySlipData.salaryComponents.HRA}
            onChange={(e)=>setSalarySlipData((prev)=> ({...prev, salaryComponents : { ...prev.salaryComponents, HRA : e.target.value }}))}
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="department" className='text-sm lg:text-xs'>TA</label>
          <input
            type="text"
            id="TA"
            name="TA"
            placeholder="Travel Allowance"
            value={salarySlipData.salaryComponents.TA}
            onChange={(e)=>setSalarySlipData((prev)=> ({...prev, salaryComponents : { ...prev.salaryComponents, TA : e.target.value }}))}
            required
            className='text-sm lg:text-xs'
          />
        </div>

        <div className="form-group w-full lg:w-[48%]">
          <label htmlFor="department" className='text-sm lg:text-xs'>DA</label>
          <input
            type="text"
            id="DA"
            name="DA"
            placeholder="Dareness Allowance"
            value={salarySlipData.salaryComponents.DA}
            onChange={(e)=>setSalarySlipData((prev)=> ({...prev, salaryComponents : { ...prev.salaryComponents, DA : e.target.value }}))}
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

export default EditSalarySlip;
