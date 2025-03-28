
import {Navigate, Outlet, useLocation} from "react-router-dom"
import {useEffect, useState} from "react";
import {useAuth} from "../provider/AuthProvider.tsx";

export const ProtectedRoute = () => {

    const location = useLocation();
    const { isAuthenticated, authLoading } = useAuth();
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    //
    // useEffect(() => {
    //     if (isLoading) return
    //
    //     const verifyAuth = async () => {
    //         console.log("ProtectedRoute");
    //         const tokensAreValid = await checkTokens();
    //         setIsAuthenticated(tokensAreValid);
    //     };
    //
    //     verifyAuth()
    // }, [isLoading]);

    //location.pathname

    if (authLoading) return <div>Loading...</div>

    return !isAuthenticated ? <Navigate to="/login" replace /> : <Outlet />;
}