import axios from 'axios';

const normalizedBase = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');
const apiBase = normalizedBase.endsWith('/api') ? normalizedBase : `${normalizedBase}/api`;

const api = axios.create({
    baseURL: apiBase,
    headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_X_API_KEY || '',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message || '';
        const path = window.location.pathname;
        const isPublic =
            path === '/' ||
            path === '/login' ||
            path === '/verify-otp' ||
            path.startsWith('/share') ||
            path === '/features' ||
            path === '/pricing' ||
            path === '/about';

        const isAuthFailure =
            status === 401 &&
            (message.includes('token') ||
                message.includes('logged in') ||
                message.includes('session'));

        if (isAuthFailure && !isPublic) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.assign('/login');
        }

        return Promise.reject(error);
    }
);

export default api;
