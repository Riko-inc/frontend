import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../provider/AuthProvider.tsx";

export const RouteForNotAuthenticated = () => {

    const { isAuthenticated } = useAuth();

    return isAuthenticated ? <Navigate to="/frontend/" replace /> : <Outlet />;
}