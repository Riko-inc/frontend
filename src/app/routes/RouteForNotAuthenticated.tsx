import {Navigate, Outlet, useLocation} from "react-router-dom"
import {useEffect, useState} from "react";
import {useAuth} from "../provider/AuthProvider.tsx";

export const RouteForNotAuthenticated = () => {

    const location = useLocation();
    const { isAuthenticated, authLoading } = useAuth();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    //
    // useEffect(() => {
    //     const verifyAuth = async () => {
    //         console.log("Not authenticated");
    //         const tokensAreValid = await checkTokens();
    //         setIsAuthenticated(tokensAreValid);
    //     };
    //
    //     verifyAuth()
    //
    // }, []);

    if (authLoading) return <div>Loading...</div>

    return isAuthenticated ? <Navigate to="/main" replace /> : <Outlet />;
}