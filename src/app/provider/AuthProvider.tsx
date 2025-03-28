import {createContext, useContext, useEffect, useState} from "react";
import {apiAxios} from "../../shared/config.ts";
import {ReactNode} from "react";
import {useQuery} from "@tanstack/react-query";


interface IJwtTokens {
    accessToken: string | null;
    refreshToken: string | null;
}

interface IAuthContext {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    setRefreshToken: (token: string | null) => void;
    // checkTokens: () => Promise<boolean>;
    isAuthenticated: boolean;
    authLoading: boolean;
}

const AuthContext = createContext<IAuthContext>({
    accessToken: null,
    setAccessToken: () => {},
    setRefreshToken: () => {},
    // checkTokens: async () => false,
    isAuthenticated: false,
    authLoading: false,
});

interface AuthProviderProps {
    children: ReactNode;
}
const AuthProvider = ({ children }: AuthProviderProps) => {

    const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem("accessToken") || null);
    const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem("refreshToken") || null);


    useEffect(() => {
        if (accessToken && refreshToken) {
            localStorage.setItem("accessToken", accessToken)
            localStorage.setItem("refreshToken", refreshToken)
            console.log("set tokens")
        }
        else {
            localStorage.removeItem("accessToken")
            localStorage.removeItem("refreshToken")
            console.log("remove tokens")
        }
        // setIsLoading(false)
    }, [accessToken, refreshToken])


    const {data: isAuthenticated = false, isLoading } = useQuery<boolean>({
        queryKey: ['auth-check'],
        queryFn: async () => {
            if (!accessToken && !refreshToken) return false

            try {
                console.log("check accessToken")
                const isAccessTokenValid = await apiAxios.get("/auth/check-token", {
                    headers: {
                        'Authorization': accessToken,
                        'Content-Type': 'application/json',
                    },
                })
                if (isAccessTokenValid.data) return true
            } catch (error) {
                console.error('Token check failed:', error);
                return false
            }



            //проблема здесь
            try {
                console.log("check refreshToken")
                const isRefreshTokenValid = await apiAxios.get("/auth/check-token", {
                    headers: {
                        'Authorization': refreshToken,
                        'Content-Type': 'application/json',
                    },
                })
                if (!isRefreshTokenValid.data) return false
            } catch (error) {
                console.error('Token check failed:', error);
                return false
            }

            try {
                console.log("get new tokens")
                const response = await apiAxios.post("/auth/refresh-token", {
                        refreshToken: refreshToken },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                setAccessToken(response.data.accessToken);
                setRefreshToken(response.data.refreshToken);
                return true;
            } catch (error) {
                setAccessToken(null);
                setRefreshToken(null);
                return false;
            }

        },
        // retry: 1
    })

    // let isChecking = false;
    // const checkTokens = async (): Promise<boolean> => {
    //     console.log("Checking tokens");
    //     const accessTokenIsValid: boolean = await isTokenValid(accessToken)
    //     if (accessTokenIsValid) {
    //         console.log("accessToken is valid");
    //         return true;
    //     }
    //
    //     const refreshTokenIsValid: boolean = await isTokenValid(refreshToken)
    //     if (!refreshTokenIsValid) {
    //         console.log("refreshToken is invalid");
    //         return false;
    //     }
    //
    //     const tokens: IJwtTokens | null = await getNewTokens(refreshToken)
    //     if (!tokens) {
    //         console.log("no tokens (");
    //         setAccessToken(null);
    //         setRefreshToken(null);
    //         return false;
    //     }
    //     console.log("refreshToken is valid");
    //     setAccessToken(tokens.accessToken);
    //     setRefreshToken(tokens.refreshToken);
    //     return true;
    // }
    //
    // const isTokenValid = async (token: string | null): Promise<boolean> => {
    //     console.log("validing token", token);
    //     if (token === null) {
    //         return false;
    //     }
    //
    //     try {
    //         const response = await apiAxios.get("/auth/check-token", {
    //             headers: {
    //                 'Authorization': token,
    //                 'Content-Type': 'application/json',
    //             },
    //         })
    //         return response.data;
    //     } catch (error) {
    //         console.error('Token check failed:', error);
    //         return false;
    //     }
    // }
    //
    // const getNewTokens = async (refreshToken: string | null): Promise<IJwtTokens | null> => {
    //     if (refreshToken === null) {
    //         return null;
    //     }
    //     try {
    //         const response = await apiAxios.post("/auth/refresh-token", {
    //                 refreshToken: refreshToken,
    //             },
    //             {
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 }
    //             })
    //         return response.data;
    //     } catch (error) {
    //         console.error('Get token failed:', error);
    //         return null;
    //     }
    // }

    const value = {
        accessToken,
        setAccessToken,
        setRefreshToken,
        // checkTokens,
        isAuthenticated,
        authLoading: isLoading
    };

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