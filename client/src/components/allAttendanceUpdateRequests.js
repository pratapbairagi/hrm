import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { allAttendanceRequestsList, updateAttendance, updateAttendanceRequest } from '../services/attendanceService';

const AllAttendanceUpdateRequests = () => {
  const [AttendanceRequests, setAttendanceRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedData, setSelectedData] = useState(""); // Keeps track of the selected attendance data

  // State for Popup Form
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Fetch the leave data from an API or use mock data
    async function fetchData() {
      setLoading(true);
      try {
        const response = await allAttendanceRequestsList();
        setAttendanceRequests(response?.attendanceRequestsList || []);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Something went wrong!", error);
      }
    }
    fetchData();
  }, []);

  // Submit the updated attendance request
  const handleSubmitRequest = async () => {
    // Implement the API call here to submit the updated data
    const response = await updateAttendance(selectedData);
    console.log("response ", response)
    if(response.success){
        toast.success("Attendance request updated successfully!");
        setShowPopup(false);
    }
  };

  console.log(" selected data ", selectedData)

  return (
    <div className="w-full overflow-x-auto p-4">
      <h2 className="text-xl font-semibold mb-4">All Attendance & Overtime Requests</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Employee Name</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Attendance Req.</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Over Time Add</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Date</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Approve</th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-200">Actions</th>
          </tr>
        </thead>
        <tbody>
          {AttendanceRequests.length === 0 ? (
            <tr>
              <td colSpan="8" className="px-4 py-2 text-center text-gray-500">No attendance data available.</td>
            </tr>
          ) : (
            AttendanceRequests.map((attend) => (
              <tr key={attend.employeeId} className="border-t">
                <td className="px-4 py-2 text-sm text-gray-700">{attend.employeeName}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{attend.requests.status}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{attend.requests.overTime}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{attend.date}</td>
                <td className="px-4 py-2 text-sm text-gray-700">{attend.requests.approve}</td>
                <td className="px-4 py-2 text-sm text-gray-700">
                  {attend.requests.requested === "yes" ? (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedData(attend);
                          setShowPopup(true);
                        }}
                        className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                        disabled={loading}
                      >
                        Approve / Reject
                      </button>
                    </div>
                  ) : (
                    <span className="text-gray-400">No Actions</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg w-96">
            <h3 className="text-xl font-semibold text-center">Request Attendance / Overtime</h3>
            <div className="mt-4">
              <label htmlFor="attendanceRequest" className="block text-sm font-medium">Attendance Request</label>
              <select
                id="attendanceRequest"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={selectedData?.requests?.status || ""}
                onChange={(e) =>
                  setSelectedData((prevData) => ({
                    ...prevData,
                    requests: { ...prevData.requests, status: e.target.value },
                  }))
                }
              >
                <option value="Leave">Leave</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Weekoff">Weekoff</option>
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="overtimeRequest" className="block text-sm font-medium">Overtime Request</label>
              <input
                id="overtimeRequest"
                value={ selectedData?.requests?.overTime || 0}
                onChange={(e) =>
                  setSelectedData((prevData) => ({
                    ...prevData,
                    requests: { ...prevData.requests, overTime: Number( e.target.value )},
                  }))
                }
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                type="number"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="attendanceRequest" className="block text-sm font-medium">Request Approval</label>
              <select
                id="attendanceRequest"
                className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                value={selectedData?.requests?.approve || "no"}
                onChange={(e) =>
                  setSelectedData((prevData) => ({
                    ...prevData,
                    requests: { ...prevData.requests, approve: e.target.value },
                  }))
                }
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSubmitRequest}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Submit
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="ml-2 px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllAttendanceUpdateRequests;
