import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoutes: React.FC = () => {
    // Basic check for auth token. Replace with your actual auth context or token logic
    const isAuthenticated = !!localStorage.getItem('token');

    // For testing purposes, if you want to bypass auth, change the above to: const isAuthenticated = true;

    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
