import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser } from '@/types/user';

interface AuthState {
    token: string | null;
    user: AuthUser | null;
}

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

function loadAuth(): AuthState {
    try {
        const token = localStorage.getItem(TOKEN_KEY);
        const rawUser = localStorage.getItem(USER_KEY);
        return {
            token,
            user: rawUser ? (JSON.parse(rawUser) as AuthUser) : null,
        };
    } catch {
        return { token: null, user: null };
    }
}

const persistAuth = (state: AuthState) => {
    if (state.token && state.user) {
        localStorage.setItem(TOKEN_KEY, state.token);
        localStorage.setItem(USER_KEY, JSON.stringify(state.user));
    } else {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
    }
};

const initialState: AuthState = loadAuth();

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action: PayloadAction<{ token: string; user: AuthUser }>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
            persistAuth(state);
        },
        logout: (state) => {
            state.token = null;
            state.user = null;
            persistAuth(state);
        },
    },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
