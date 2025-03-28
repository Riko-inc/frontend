import {createContext, useContext, useEffect, useState} from "react";
import {apiAxios} from "../../shared/config.ts";
import {ReactNode} from "react";

interface JwtTokens {
    accessToken: string | null;
    refreshToken: string | null;
}

interface IAuthContext {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
    checkTokens: () => Promise<boolean>;
}

interface AuthProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({
    accessToken: null,
    setAccessToken: () => {},
    setRefreshToken: () => {},
    checkTokens: async () => false,
});

const AuthProvider = ({ children }: AuthProviderProps) => {

    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken") || null);

    useEffect(() => {
        if ((!!accessToken && !!refreshToken)) {
            localStorage.setItem("accessToken", accessToken);
            localStorage.setItem("refreshToken", refreshToken);
        }
        else {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        }
    }, [accessToken, refreshToken]);


    const checkTokens = async (): Promise<boolean> => {
        const accessTokenIsValid: boolean = await isTokenValid(accessToken)
        if (accessTokenIsValid) {
            return true;
        }

        const refreshTokenIsValid: boolean = await isTokenValid(refreshToken)
        if (!refreshTokenIsValid) {
            return false;
        }

        const tokens: JwtTokens | null = await getNewTokens(refreshToken)
        if (!tokens) {
            setAccessToken(null);
            setRefreshToken(null);
            return false;
        }
        setAccessToken(tokens.accessToken);
        setRefreshToken(tokens.refreshToken);
        return true;
    }

    const isTokenValid = async (token: string | null): Promise<boolean> => {
        if (token === null) {
            return false;
        }

        try {
            const response = await apiAxios.get("/auth/check-token", {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            })
            return response.data;
        } catch (error) {
            console.error('Token check failed:', error);
            return false;
        }
    }

    const getNewTokens = async (refreshToken: string | null): Promise<JwtTokens | null> => {
        if (refreshToken === null) {
            return null;
        }
        try {
            const response = await apiAxios.post("/auth/refresh-token", {
                    refreshToken: refreshToken,
                },
                {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`,
                        'Content-Type': 'application/json',
                    }
                })
            return response.data;
        } catch (error) {
            console.error('Get token failed:', error);
            return null;
        }
    }

    const value = {
        accessToken,
        setAccessToken,
        setRefreshToken,
        checkTokens,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthProvider;