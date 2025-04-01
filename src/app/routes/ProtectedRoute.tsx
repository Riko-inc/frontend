
import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../provider/AuthProvider.tsx";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? <Navigate to="/frontend/login" replace /> : <Outlet />;
}