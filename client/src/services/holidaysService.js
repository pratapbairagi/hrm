import axios from "axios";

// Set the base URL for your backend API
// const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL
const API_URL = 'https://kms-hrm.vercel.app/api'; // Replace with your backend URL

const config = {
  headers: {
      "Content-Type": "application/json"
  },
  withCredentials: true
}

// holidays list
export const getHolidaysList = async ({ countryCode, year }) =>{
    try {
      const response = await axios.get(`${API_URL}/holidays/list`, {countryCode, year},  config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
  
    }
  }


  // generate holidays
export const generateHolidays = async ({ countryCode, year }) =>{
    try {
      const response = await axios.post(`${API_URL}/holidays/generate`, {countryCode, year},  config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  // delete all holidays
  export const deleteAllHolidays = async () => {
    try {
      const response = await axios.delete(`${API_URL}/holidays/delete`,  config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }

  // update holidays
  export const updateHolidays = async (data) => {
    try {
      const response = await axios.put(`${API_URL}/holidays/update`, data,  config);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }