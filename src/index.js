import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import axios from 'axios'; // 1. Import axios
import { API_ENDPOINTS } from './constant/api.url'; // 2. Import your API endpoints

axios.interceptors.response.use(
  // If the response is successful, just pass it through
  (response) => response,

  // If the response has an error, this function will run
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) and we haven't already retried the request
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark this request as retried to prevent infinite loops

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            const response = await axios.post(API_ENDPOINTS.TOKEN_REFRESH, { refresh: refreshToken });
            const { access } = response.data;

            // Save the new access token
            localStorage.setItem('access_token', access);

            // Update the default authorization header for all future axios requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

            // Update the authorization header of the original failed request
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            
            // Retry the original request with the new token
              return axios(originalRequest);
        }
      } catch (refreshError) {
        // If the refresh token is also invalid, log the user out
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // For any other errors, just pass them along
    return Promise.reject(error);
  }
);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);