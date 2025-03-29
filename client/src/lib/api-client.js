// apiClient.js
import axios from 'axios';
import { HOST } from '@/utils/constant';

const apiClient = axios.create({
  baseURL: HOST,
  withCredentials: true, // For cookies/sessions
//   headers: {
//     'Content-Type': 'application/json',
//   },
});

// Add request interceptor
// apiClient.interceptors.request.use(
//   (config) => {
//     // You can add auth tokens here if needed
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// // Add response interceptor
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle errors globally
//     if (error.response) {
//       // Server responded with a status other than 2xx
//       console.error('API Error:', error.response.data);
//     } else if (error.request) {
//       // Request was made but no response received
//       console.error('Network Error:', error.message);
//     } else {
//       // Something happened in setting up the request
//       console.error('Request Error:', error.message);
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;