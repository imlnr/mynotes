import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { SidebarWrapper } from '@/components/sidebar-wrapper';
import { useAppSelector } from '@/store';

const PrivateRoutes: React.FC = () => {
    const isAuthenticated = Boolean(useAppSelector((state) => state.auth.token));

    return isAuthenticated ? (
        <SidebarWrapper>
            <Outlet />
        </SidebarWrapper>
    ) : (
        <Navigate to="/login" replace />
    );
};

export default PrivateRoutes;
