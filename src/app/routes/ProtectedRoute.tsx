
import {Navigate, Outlet} from "react-router-dom"
import {useAuth} from "../contexts/AuthContext.tsx";
import {ROUTES} from "./Routes.tsx";

export const ProtectedRoute = () => {
    const { isAuthenticated } = useAuth();

    return !isAuthenticated ? <Navigate to={ROUTES.LOGIN} replace /> : <Outlet />;
}