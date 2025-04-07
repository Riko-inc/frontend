import {createContext, useCallback, useContext, useEffect, useState} from "react";
import {API_URL} from "../../shared/config.ts";
import {ReactNode} from "react";
import {useQueryClient} from "@tanstack/react-query";
import axios from "axios";
import {IJwtTokens} from "../../pages/Login/types.ts";
import {ROUTES} from "../routes/Routes.tsx";
import {jwtDecode} from "jwt-decode";


interface IAuthContext {
    setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
    clearTokens: () => void;
    isAuthenticated: boolean;
    userId: number | null;
}

const AuthContext = createContext<IAuthContext>({
    setTokens: () => {},
    clearTokens: () => {},
    isAuthenticated: false,
    userId: null,
});


export const api = axios.create({
    baseURL: API_URL,
    headers: {
        Authorization: localStorage.getItem("accessToken")
            ? `Bearer ${localStorage.getItem("accessToken")}`
            : undefined
    }
});

interface AuthProviderProps {
    children: ReactNode;
}

interface IJwtDecodedUser {
    id: number
    email: string
    role: "USER" | "ADMIN"
    tokenType: "ACCESS" | "REFRESH"
    expires: number
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    const queryClient = useQueryClient();
    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken"));
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken"));

    const [userId, setUserId] = useState<number | null>(null);


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

    const getNewTokens = useCallback(async () => {
        if (!refreshToken) throw new Error('No refresh token');
        const response = await api.post('/auth/api/v1/auth/refresh-token', {
            "refreshToken": refreshToken });
        return response.data;
    }, [refreshToken]);


    const value = {
        setTokens,
        clearTokens,
        isAuthenticated: !!accessToken,
        userId,
    };

    useEffect(() => {
        if (accessToken && !userId) {
            try {
                const user: IJwtDecodedUser = jwtDecode(accessToken);
                setUserId(user.id);
                console.log("user", user.id);
            } catch (error) {
                console.error('Ошибка декодирования JWT токена:', error);
            }
        }
    }, [accessToken, userId]);



    useEffect(() => {
        const requestInterceptor = api.interceptors.request.use(config => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                console.log("bearer");
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        });

        const responseInterceptor = api.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;

                if (error.response?.status === 403 && !originalRequest._retry) {
                    if (originalRequest.url.includes('refresh-token')) {
                        clearTokens();
                        window.location.href = ROUTES.LOGIN;

                        return Promise.reject(error);
                    }

                    originalRequest._retry = true;

                    try {
                        const newTokens: IJwtTokens = await getNewTokens();
                        setTokens(newTokens);
                        // originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                        return api(originalRequest);
                    } catch (refreshError) {
                        clearTokens();
                        queryClient.clear();
                        window.location.href = ROUTES.LOGIN;
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
