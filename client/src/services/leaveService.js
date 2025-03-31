import axios from 'axios';

// Set the base URL for your backend API
const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL

const config = {
  headers: {
      "Content-Type": "application/json"
  },
  withCredentials: true
}

// Request a leave
export const requestLeave = async (leaveData) => {
  try {
    const response = await axios.post(`${API_URL}/leave-requests`, leaveData, config);
    return response.data;
  } catch (error) {
    console.log("error in api service file for leave request in catch part ", error)
    throw error.response ? error.response.data : error;
  }
};

// Get all leave requests (Admin only)
export const getAllLeaveRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/leave-requests`);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get leave request by employee (Admin or employee can access)
export const getLeaveRequestsByEmployee = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/leave-requests/employee/${employeeId}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update leave request status (Admin only)
export const updateLeaveRequestStatus = async (employeeId, leaveRequestId, status) => {
  try {
    const response = await axios.put(`${API_URL}/leave-requests/${employeeId}`, {leaveRequestId, status }, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// get pending leave request
export const getPendingLeaveRequests = async () => {
  try {
    const response = await axios.get(`${API_URL}/pending-leave-requests`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}
