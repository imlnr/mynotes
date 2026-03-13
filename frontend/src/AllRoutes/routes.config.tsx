import React from 'react';
import Login from '../pages/Authentication/Login';
import VerifyOtp from '../pages/Authentication/VerifyOtp';
import LandingPage from '../pages/Public/LandingPage';
import Dashboard from '../pages/Private/Dashboard';
import NoteEditor from '../pages/Private/NoteEditor';

const Signup = () => <div className="p-4" > Signup Page </div>;

interface RouteConfig {
    path: string;
    component: React.ComponentType<any>;
}

export const publicRoutes: RouteConfig[] = [
    { path: '/', component: LandingPage },
    { path: '/login', component: Login },
    { path: '/verify-otp', component: VerifyOtp },
    { path: '/signup', component: Signup },
];

export const privateRoutes: RouteConfig[] = [
    { path: '/dashboard', component: Dashboard },
    { path: '/dashboard/note/:id', component: NoteEditor },
    { path: '/dashboard/note/new', component: NoteEditor },
];
