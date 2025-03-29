import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {API_URL} from "../../shared/config.ts";
import {ReactNode} from "react";
import {useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {IJwtTokens} from "../../pages/Log in/types.ts";


interface IAuthContext {
    accessToken: string | null;
    refreshToken: string | null;
    setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
    clearTokens: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<IAuthContext>({
    accessToken: null,
    refreshToken: null,
    setTokens: () => {},
    clearTokens: () => {},
    isAuthenticated: false
});

interface AuthProviderProps {
    children: ReactNode;
}

export const api = axios.create({
    baseURL: API_URL
});

const AuthProvider = ({ children }: AuthProviderProps) => {
    const queryClient = useQueryClient();
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken") || null);


    const getNewTokens = useCallback(async () => {
        if (!refreshToken) throw new Error('No refresh token');
        const response = await api.post('/auth/refresh', { refreshToken });
        return response.data;
    }, [refreshToken]);

    const setTokens = useCallback(({ accessToken, refreshToken }: IJwtTokens) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        setAccessToken(accessToken);
        setRefreshToken(refreshToken);
    }, []);

    const clearTokens = useCallback(() => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setAccessToken(null);
        setRefreshToken(null);
    }, []);

    const value = {
        accessToken,
        refreshToken,
        setTokens,
        clearTokens,
        isAuthenticated: !!accessToken,
    };


    useEffect(() => {

        const requestInterceptor = api.interceptors.request.use(config => {
            if (accessToken) {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
        });

        const responseInterceptor = api.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 403 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    try {
                        const newTokens: IJwtTokens = await getNewTokens();
                        setTokens(newTokens);
                        originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        clearTokens();
                        queryClient.clear();
                        // navigate('/login');
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                }

                return Promise.reject(error);
            }
        );

        return () => {
            api.interceptors.request.eject(requestInterceptor);
            api.interceptors.response.eject(responseInterceptor);
        };

    }, [accessToken, refreshToken])

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export default AuthProvider;
