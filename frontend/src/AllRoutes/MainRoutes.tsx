import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes.config';
import PrivateRoutes from './PrivateRoutes';

const MainRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Routes */}
            {publicRoutes.map((route, index) => (
                <Route
                    key={index}
                    path={route.path}
                    element={<route.component />}
                />
            ))}

            {/* Private Routes wrapped by PrivateRoutes component */}
            <Route element={<PrivateRoutes />}>
                {privateRoutes.map((route, index) => (
                    <Route
                        key={`private-${index}`}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<div className="p-4 text-center">404 - Page Not Found</div>} />
        </Routes>
    );
};

export default MainRoutes;
