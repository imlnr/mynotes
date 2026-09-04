import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

const Login = lazy(() => import('../pages/Authentication/Login'));
const VerifyOtp = lazy(() => import('../pages/Authentication/VerifyOtp'));
const LandingPage = lazy(() => import('../pages/Public/LandingPage'));
const FeaturesPage = lazy(() => import('../pages/Public/FeaturesPage'));
const PricingPage = lazy(() => import('../pages/Public/PricingPage'));
const AboutPage = lazy(() => import('../pages/Public/AboutPage'));
const SharedNote = lazy(() => import('../pages/Public/SharedNote'));
const Dashboard = lazy(() => import('../pages/Private/Dashboard'));
const NoteEditor = lazy(() => import('../pages/Private/NoteEditor'));

interface RouteConfig {
    path: string;
    component: LazyExoticComponent<ComponentType>;
}

export const publicRoutes: RouteConfig[] = [
    { path: '/', component: LandingPage },
    { path: '/login', component: Login },
    { path: '/signup', component: Login },
    { path: '/verify-otp', component: VerifyOtp },
    { path: '/features', component: FeaturesPage },
    { path: '/pricing', component: PricingPage },
    { path: '/about', component: AboutPage },
    { path: '/share/:shareId', component: SharedNote },
];

export const privateRoutes: RouteConfig[] = [
    { path: '/dashboard', component: Dashboard },
    { path: '/dashboard/note/new', component: NoteEditor },
    { path: '/dashboard/note/:id', component: NoteEditor },
];
