import {useAuth} from "../provider/AuthProvider.tsx";
import {Navigate, Outlet, useLocation} from "react-router-dom"
import {useEffect} from "react";

export const RouteForNotAuthenticated = () => {

    const location = useLocation();
    const { checkTokens } = useAuth();

    useEffect(() => {
        const verifyAuth = async () => {
            const tokensAreValid = await checkTokens();

            if (tokensAreValid) {
                return <Navigate to="/main" />;
            }
        };

        verifyAuth()
            .then(r => r);
    }, [location.pathname]);

    return <Outlet />
}