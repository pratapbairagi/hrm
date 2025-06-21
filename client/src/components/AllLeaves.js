import React, { useState, useEffect } from 'react';
import { getAllLeaveRequests, updateLeaveRequestStatus } from '../services/leaveService';
import { toast } from 'react-toastify';

const AllLeaves = () => {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch the leave data from an API or use mock data
    async function fetchData(){
      setLoading(true);
      try {
        const response = await getAllLeaveRequests();
        setLeaveRequests(response?.leaveRequests || []);
        setLoading(false)
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong ! ",error)
      }
    };
    fetchData();
  }, []);

  // Function to handle the status update
  const handleStatusChange = async (employeeId, leaveRequestId, status ) => {
    try {
      // Call the API to update the status (this could be a PUT or PATCH request)
     const response = await updateLeaveRequestStatus(employeeId, leaveRequestId, status);

     setLeaveRequests(response.allLeaves)
      console.log("response status ", response)

      // // Update the state locally to reflect the status change
      // setLeaveRequests((prevState) => {
      //   return prevState.map((employee) => {
      //     if (employee.employeeId === employeeId) {
      //       return {
      //         ...employee,
      //         leaves: employee.leaves.map((leave) => {
      //           if (leave.leaveId === leaveId) {
      //             return { ...leave, status: newStatus }; // Update the status
      //           }
      //           return leave;
      //         }),
      //       };
      //     }
      //     return employee;
      //   });
      // });
    } catch (error) {
      console.error("Error updating leave status:", error);
    }
  };

  console.log("all leaves ", leaveRequests)

  return (
    <div className="w-full overflow-x-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Leave Requests</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Employee Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Department</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Role</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Leave Type</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Leave Start Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Leave End Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Leave Status</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leaveRequests.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-2 text-center text-gray-500">No leave data available.</td>
            </tr>
          ) : (
            leaveRequests.map((employee) =>{
               return <tr key={`${employee.employeeId}`} className="border-t">
                  <td className="px-4 py-2 text-sm text-gray-700">{employee.employeeName}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{employee.employeeDepartment}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{employee.employeePosition}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{employee.leaveType}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{employee.leaveStart}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">{employee.leaveEnd}</td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    <span
                      className={`font-bold ${employee.status === "pending" ? "text-yellow-500" : "text-green-500"}`}
                    >
                      {employee.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-700">
                    {employee.status === "pending" ? (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(employee.employeeId, employee._id, "approved")}
                          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                          disabled={loading}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStatusChange(employee.employeeId, employee._id, "rejected")}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                          disabled={loading}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">No Actions</span>
                    )}
                  </td>
                </tr>
          
})
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AllLeaves;
