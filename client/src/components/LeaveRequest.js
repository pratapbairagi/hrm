import React, { useEffect, useState } from 'react';
// import { requestLeave } from '../services/api';
import { toast } from 'react-toastify'; // Optional: for better error/success messages
import { getLeaveRequestsByEmployee, requestLeave } from '../services/leaveService';

const LeaveRequest = ({ user }) => {

  const [leaveData, setLeaveData] = useState({
    employeeId: "", // This will be updated with user._id
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [leaveBalance, setLeaveBalance] = useState([]);

  useEffect(() => {
    if (user && user._id) {
      async function fetchData() {
        setLeaveData(data => ({ ...data, employeeId: user._id }));
        const data = await getLeaveRequestsByEmployee(user._id);
          if(data?.leaveRequests.length > 0){
            const leaveBalance = data?.leaveRequests[0]?.leaveBalance
            const arr = Object.keys(data?.leaveRequests[0]?.leaveBalance);

            setLeaveBalance(arr.map(v=> ({ type : [v][0], value : leaveBalance[v] })))
            
          }
      }
      fetchData();
    }
  }, [user]);

  console.log("leaveData ", leaveData)

  const handleChange = (e) => {
    setLeaveData({ ...leaveData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // e.preventDefault();
    // alert("working component")
    try {
      const response = await requestLeave(leaveData);
      if (response) {
        toast.success("Leave request submitted successfully !")
        // alert("Leave request submitted successfully!");
      }
    } catch (error) {
      // alert("Error submitting leave request. Please try again.");
      toast.error("Error requesting leave : ", error)
      console.error("Error requesting leave:", error);
    }
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gray-100 py-2 px-4 sm:px-6 lg:px-8">
      <div className="w-full bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">Request Leave</h2>

        <div className="space-y-2">
          {/* Leave Type */}
          <div>
            <label htmlFor="leaveType" className="block text-sm font-medium text-gray-600">
              Leave Type
            </label>
            <select
              id="leaveType"
              name="leaveType"
              // value={leaveData.leaveType}
              defaultValue={leaveData.leaveType}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {leaveBalance.map((lt) => (
                <option value={lt.type} key={lt.type} className='p-2'>
                 <span>{lt.type}</span> 
                 <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                 <span>{lt.value}</span> 
                </option>
              ))}
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-600">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={leaveData.startDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* End Date */}
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-600">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={leaveData.endDate}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Reason */}
          <div>
            <label htmlFor="reason" className="block text-sm font-medium text-gray-600">
              Reason
            </label>
            <textarea
              id="reason"
              name="reason"
              value={leaveData.reason}
              onChange={handleChange}
              rows="4"
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            ></textarea>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              disabled={loading}
              onClick={handleSubmit}
            >
              {loading ? "Loading..." : "Submit Request"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequest;
