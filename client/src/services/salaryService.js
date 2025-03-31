import axios from 'axios';

// Set the base URL for your backend API
const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL
const config = {
  headers: {
      "Content-Type": "application/json"
  },
  withCredentials: true
}

// Generate salary slip for a given month
export const generateSalarySlip = async (salaryData) => {
  try {
    const response = await axios.post(`${API_URL}/salary-slips`, salaryData, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get salary slips for an employee
export const getEmployeeSalarySlips = async (employeeId) => {
  try {
    const response = await axios.get(`${API_URL}/salary-slips/employee/${employeeId}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// calculate salary
export const calculateSalary = async ( employeeId, month, year ) => {
  try {
    const response = await axios.post(`${API_URL}/salary-slips/employee/${employeeId}`, {month, year}, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

// get available months and years list of employee
export const getAvailableYearsAndMonthsListForSalary = async ( employeeId ) => {
  try {
    const response = await axios.get(`${API_URL}/salary-availble/${employeeId}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

// get monthly salary of every month

export const getEveryMonthNetSalary = async ( employeeId ) => {
  try {
    const response = await axios.get(`${API_URL}/salary-availble-every-month/${employeeId}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

// get salary slip in details
export const getDetailedSlip = async ( employeeId, month ) => {
  try {
    const response = await axios.get(`${API_URL}/salary/${employeeId}/${month}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

// set weekoff
export const setWeekoff = async (employeeId, data) => {
  try {
    const response = await axios.post(`${API_URL}/salary/set-weekoff/`, { employeeId, data }, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}