// src/config/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // Check for the access token in localStorage
    const token = localStorage.getItem('access_token');

    if (!token) {
        // If no token, redirect to the login page
        return <Navigate to="/login" replace />;
    }

    // If token exists, render the child component (the protected page)
    return children;
};

export default ProtectedRoute;