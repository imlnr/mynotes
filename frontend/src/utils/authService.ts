import api from './axios';
import type { AuthUser } from '@/types/user';

interface AuthResponse {
    status: string;
    token: string;
    user: AuthUser;
}

const AuthService = {
    sendOtp: async (email: string) => {
        const response = await api.post('/auth/send-otp', { email });
        return response.data;
    },

    verifyOtp: async (email: string, otp: string) => {
        const response = await api.post<AuthResponse>('/auth/verify-otp', { email, otp });
        return response.data;
    },

    googleLogin: async (accessToken: string) => {
        const response = await api.post<AuthResponse>('/auth/google', { accessToken });
        return response.data;
    },
};

export default AuthService;
