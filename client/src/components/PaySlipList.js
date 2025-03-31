import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAvailableYearsAndMonthsListForSalary, getEmployeeSalarySlips, getEveryMonthNetSalary } from '../services/salaryService';

const PaySlipList = ({ user }) => {
  const { employeeId } = useParams(); // Get employee ID from URL params
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate(); // useNavigate hook for navigation
  const [availableSalarySlip, setAvailableSalarySlip] = useState([]);

  useEffect(() => {

    async function fetchYearsMonth() {
      const data = await getEveryMonthNetSalary(employeeId);
      if (data.success) {
        setAvailableSalarySlip(data.monthlyNetSalaries)
      }
    }
    fetchYearsMonth()

  }, [employeeId]);

  // if (!employee) return <div className="text-center p-8">Loading...</div>;

  // Handle redirection to detailed pay slip
  const handleRedirect = (month, year) => {
    // navigate(`/pay-slip-detail/${employeeId}/${month}/${year}`);
    navigate(`/pay-slip-detail/${employeeId}/${month}`);
  };

  // Handle download for selected month
  const handleDownload = (month, year) => {
    const paySlip = employee.paySlip.find(item => item.month === month && item.year === year);
    if (paySlip) {
      const blob = new Blob([JSON.stringify(paySlip)], { type: 'application/json' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `${employee.name}_Pay_Slip_${month}_${year}.json`;
      link.click();
    }
  };

  console.log("availableSalarySlip ", availableSalarySlip)
  return (
    <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Employee Info Section */}
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-gray-800">Pay Slip for {availableSalarySlip.length > 0 ? availableSalarySlip[0].employeeName : "NO Name"}</h2>
          <div className="mt-4 md:flex md:space-x-6">
            {/* Left Section - Employee Info */}
            <div className="md:w-1/3">
              <p className="text-lg text-gray-600">Position: {availableSalarySlip.length > 0 ? availableSalarySlip[0].position : "Not Updated"}</p>
              <p className="mt-1 text-lg text-gray-600">Joining Date: {availableSalarySlip.length > 0 ? availableSalarySlip[0].joining_date : "NO Name"}</p>
              <p className="mt-1 text-lg text-gray-600">Salary: {availableSalarySlip.length > 0 ? availableSalarySlip[0].salary : "NO Name"}</p>
            </div>

            {/* Right Section - Monthly Salary Table */}
            <div className="mt-6 md:mt-0 md:w-2/3">
              <h3 className="text-2xl font-semibold text-gray-800">Pay Slip History</h3>
              <div className="overflow-x-auto mt-4 bg-gray-50 rounded-lg">
                <table className="min-w-full table-auto">
                  <thead className="bg-indigo-500 text-white">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium">Year-Month</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Payable Salary</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Salary</th>
                      <th className="px-4 py-2 text-left text-sm font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {availableSalarySlip?.map((item, index) => {
                     return <tr key={index}>
                        <td className="px-4 py-3 text-sm text-gray-700">{item.month}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">${item.payableSalary.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">${item.salary?.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">
                          <button
                            onClick={() => handleRedirect(item.month, item.year)}
                            className="bg-blue-500 text-white px-3 py-1 rounded-md mr-2"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleDownload(item.month, item.year)}
                            className="bg-green-500 text-white px-3 py-1 rounded-md"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Button Section */}
        </div>
      </div>
    </div>
  );
};

export default PaySlipList;
