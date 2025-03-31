import axios from 'axios';

// Set the base URL for your backend API
const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL
const config = {
    headers: {
        "Content-Type": "application/json"
    },
    withCredentials: true
}

// Register a new user (Admin can add employees)
export const createUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Login (authentication for employees/admins)
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Login (authentication for employees/admins)
export const loggedUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/logged`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Get a specific user (by ID)
export const getUserById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/user/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// delete user (by ID)
export const deleteUserById = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/user/delete/${id}`, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};

// Update a user profile (Admin only)
export const updateUser = async (userId, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, updatedData, config);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
};


// logout
export const logoutUser = async () => {
  try {
    await axios.get(`${API_URL}/logout`, config);
    window.location.reload()
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

// dashboard contents
export const getDashabordContents = async () => {
  try {
   const response = await axios.get(`${API_URL}/dashboard`, config);
    return response.data;
  } catch (error) {
    console.log("admin contents error ", error)
    throw error.response ? error.response.data : error;
  }
}