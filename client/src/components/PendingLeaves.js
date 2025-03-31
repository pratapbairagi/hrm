

import React, { useState, useEffect } from 'react';
import { getPendingLeaveRequests } from '../services/leaveService';

// Mocked data for pending leaves (you would replace this with data from an API)
const mockPendingLeaves = [
  {
    employeeName: "John Doe",
    department: "Engineering",
    role: "Software Engineer",
    leaveType: "Sick Leave",
    leaveStart: "2024-11-20",
    leaveEnd: "2024-11-22",
    status: "Pending",
  },
  {
    employeeName: "Jane Smith",
    department: "HR",
    role: "HR Manager",
    leaveType: "Vacation",
    leaveStart: "2024-11-21",
    leaveEnd: "2024-11-25",
    status: "Pending",
  },
  {
    employeeName: "Mark Johnson",
    department: "Marketing",
    role: "Marketing Specialist",
    leaveType: "Emergency Leave",
    leaveStart: "2024-11-18",
    leaveEnd: "2024-11-19",
    status: "Pending",
  },
  {
    employeeName: "Emily Davis",
    department: "Finance",
    role: "Accountant",
    leaveType: "Maternity Leave",
    leaveStart: "2024-12-01",
    leaveEnd: "2024-12-15",
    status: "Pending",
  },
];

const PendingLeaves = () => {
  const [pendingLeaves, setPendingLeaves] = useState([]);

  useEffect(() => {
    // Fetch pending leaves from API or use mock data
    
    async function fetchdata(){
      const data = await getPendingLeaveRequests();
      setPendingLeaves(data.pendingLeaveRequests || []);
    }
    fetchdata()
    
  }, []);

  return (
    <div className="w-full overflow-x-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Pending Leave Requests</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Employee Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Department</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Emp. ID</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Leave Type</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Start Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">End Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Status</th>
          </tr>
        </thead>
        <tbody>
          {pendingLeaves.length === 0 ? (
            <tr>
              <td colSpan="7" className="px-4 py-2 text-center text-gray-500">No pending leave requests.</td>
            </tr>
          ) : (
            pendingLeaves.map((leave, index) => (
              <tr key={index} className="border-t">
                <td className="px-4 py-2 text-sm text-gray-700">{leave?.employeeName || "No Name"}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{leave.employeeDepartment || "Not Updated"}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{leave.employeeId || "Not Updated" }</td>
                <td className="px-4 py-2 text-sm text-gray-700">{leave.leaveType}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{leave.startDate}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{leave.endDate}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  <span className="text-yellow-500 font-bold">{leave.status}</span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PendingLeaves;
