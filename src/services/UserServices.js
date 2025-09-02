import axios from 'axios';
import { API_ENDPOINTS } from '../constant/api.url';

// Helper to get the access token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('access_token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(API_ENDPOINTS.REGISTER, userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(API_ENDPOINTS.LOGIN, credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const logoutUser = async (refreshToken) => {
    try {
        // We must send the refresh token to the backend to be blacklisted
        const response = await axios.post(API_ENDPOINTS.LOGOUT, { refresh_token: refreshToken }, {
            headers: getAuthHeader() // We also need to be authenticated to logout
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getUserProfile = async () => {
    try {
        // Send the request with the Authorization header
        const response = await axios.get(API_ENDPOINTS.PROFILE, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const getBookList = async () => {
    try {
        // Send the request with the Authorization header
        const response = await axios.get(API_ENDPOINTS.BookList, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// Function to create a new book
export const addBook = async (bookData) => {
    try {
        const response = await axios.post(API_ENDPOINTS.BookList, bookData, {
            headers: getAuthHeader()
        });
        return response.data;
    } catch (error) {
        // We throw the whole error object to get more details in the component
        throw error;
    }
};