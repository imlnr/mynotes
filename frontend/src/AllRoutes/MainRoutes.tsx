import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { publicRoutes, privateRoutes } from './routes.config';
import PrivateRoutes from './PrivateRoutes';
import { Spinner } from '@/components/ui/spinner';
import NotFound from '@/pages/Public/NotFound';

const MainRoutes: React.FC = () => {
    return (
        <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center">
            <Spinner />
        </div>
        }>
            <Routes>
                {publicRoutes.map((route) => (
                    <Route
                        key={route.path}
                        path={route.path}
                        element={<route.component />}
                    />
                ))}

                <Route element={<PrivateRoutes />}>
                    {privateRoutes.map((route) => (
                        <Route
                            key={route.path}
                            path={route.path}
                            element={<route.component />}
                        />
                    ))}
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default MainRoutes;
