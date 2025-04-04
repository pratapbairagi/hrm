// /src/services/api.js
import axios from 'axios';

// const API_URL = 'http://localhost:5000/api';  // Ensure the backend URL is correct
const API_URL = 'https://kms-hrm.vercel.app/api';  // Ensure the backend URL is correct

// API calls for Employee Management
// export const getEmployees = async () => {
//   return await axios.get(`${API_URL}/employees`);
// };

export const updateAttendance = async (id, attendanceData) => {
  return await axios.post(`${API_URL}/employees/attendance/${id}`, attendanceData);
};

// API calls for Leave Requests
export const requestLeave = async (id, leaveData) => {
  return await axios.post(`${API_URL}/employees/leave/${id}`, leaveData);
};

// API calls for Salary Generation
export const generatePayroll = async (id, payrollData) => {
  return await axios.post(`${API_URL}/employees/payroll/${id}`, payrollData);
};

// Function to add an employee
export const addEmployee = async (employeeData) => {
    try {
      const response = await axios.post(API_URL, employeeData);
      return response.data;
    } catch (error) {
      throw new Error('Error adding employee: ' + error.message);
    }
  };

  // Get all employees
export const getEmployees = async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw new Error('Error fetching employees: ' + error.message);
    }
  };
  
  // Delete employee
  export const deleteEmployee = async (employeeId) => {
    try {
      const response = await axios.delete(`${API_URL}/${employeeId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error deleting employee: ' + error.message);
    }
  };

// notification
  export const getNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications'); // Replace with your actual API endpoint
      return response.data; // Assuming the API returns an array of notifications
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return []; // Return an empty array if there is an error
    }
  };