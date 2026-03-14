import { lazy } from 'react';

// Lazy load page components
const Login = lazy(() => import('../pages/Authentication/Login'));
const VerifyOtp = lazy(() => import('../pages/Authentication/VerifyOtp'));
const LandingPage = lazy(() => import('../pages/Public/LandingPage'));
const Dashboard = lazy(() => import('../pages/Private/Dashboard'));
const NoteEditor = lazy(() => import('../pages/Private/NoteEditor'));

const Signup = () => <div className="p-4" > Signup Page </div>;

interface RouteConfig {
    path: string;
    // Using any because React.lazy components have a specific shape that 
    // satisfies ComponentType but can be tricky with exact type definitions
    component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
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
