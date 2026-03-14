import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes.config';
import PrivateRoutes from './PrivateRoutes';
import { Spinner } from '@/components/ui/spinner';

const MainRoutes: React.FC = () => {
    return (
        <Suspense fallback={<div className='h-screen w-screen flex items-center justify-center'>
            <Spinner />
        </div>
        }>
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
        </Suspense>
    );
};

export default MainRoutes;
