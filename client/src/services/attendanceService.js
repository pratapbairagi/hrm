import axios from 'axios';

// Set the base URL for your backend API
// const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL
const API_URL = 'https://kms-hrm.vercel.app/api'; // Replace with your backend URL

const config = {
  headers: {
      "Content-Type": "application/json"
  },
  withCredentials: true
}

// Mark attendance for today
export const markAttendance = async (attendanceData) => {
  try {
    const response = await axios.post(`${API_URL}/attendance`, attendanceData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Mark attendance for today
export const markAttendanceBasedOnQRScan = async (attendanceData) => {
  try {
    const response = await axios.post(`${API_URL}/qr/attendance`, attendanceData);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get today's attendance for all employees (Admin only)
export const getTodayAttendance = async () => {
  try {
    const response = await axios.get(`${API_URL}/attendance/today`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get attendance by employee (Admin or employee can access)
export const getEmployeeAttendance = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/attendance/employee/${employeeId}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// attendance update request
export const attendanceUpdateRequest = async ({ userId, date, data }) =>{
  try {
    const response = await axios.post(`${API_URL}/attendance/request/${userId}`, {...data, userId, date},  config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;

  }
}

export const attendanceUpdateFromPublicQrScan = async ({ userId, date, checkInTime, checkOutTime, loginDuration, type }) =>{

  try {
    const response = await axios.post(`${API_URL}/public/attendance/update/${userId}`, { userId, date, checkInTime, checkOutTime, loginDuration, type},  config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

// attendance requests
export const allAttendanceRequestsList = async () => {
  try {
    const response = await axios.get(`${API_URL}/attendance/requests`,  config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

// attendance request update - reject/approve for OT or Present/Leave
export const updateAttendance = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/attendance/update`, data, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}
