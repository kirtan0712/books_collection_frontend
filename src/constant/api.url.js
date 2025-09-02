export const BACKEND_URL =
    process.env.REACT_APP_ENV === "dev"
        ? process.env.REACT_APP_DEV_URL
        : process.env.REACT_APP_PROD_URL

const BASE_URL = process.env.REACT_APP_DEV_URL;

export const API_ENDPOINTS = {
    REGISTER: `${BASE_URL}/api/users/register/`,
    LOGIN: `${BASE_URL}/api/users/login/`,
    LOGOUT: `${BASE_URL}/api/users/logout/`,
    PROFILE: `${BASE_URL}/api/users/profile/`,
    BookList: `${BASE_URL}/api/books/list/`,
    TOKEN_REFRESH: `${BASE_URL}/api/users/token/refresh/`,    
};