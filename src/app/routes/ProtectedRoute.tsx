
import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../provider/AuthProvider.tsx";
import {ROUTES} from "./Routes.tsx";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? <Navigate to={ROUTES.LOGIN} replace /> : <Outlet />;
}