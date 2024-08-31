// src/axiosInstance.js

import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000', // Replace with your backend URL
  withCredentials: true, // Include cookies in requests
});

export default axiosInstance;
