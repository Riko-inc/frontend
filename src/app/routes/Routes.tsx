import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {RouteForNotAuthenticated} from "./RouteForNotAuthenticated.tsx";

const Routes = () => {

    const routesForPublic = [
        {
            path: "/about-us",
            element: <div>About us</div>
        }
    ]

    const routesForAuthenticatedOnly = [
        {
            path: "/",
            element: <ProtectedRoute />,
            children: [
                {
                    path: "/main",
                    element: <div>Main page</div>,
                }
            ]
        }
    ]

    const routesForNotAuthenticatedOnly = [
        {
            path: "/",
            element: <RouteForNotAuthenticated />,
            children: [
                {
                    path: "/login",
                    element: <div>Авторизация</div>
                },
                {
                    path: "/sign-up",
                    element: <div>Регистрация</div>,
                }
            ]
        }

    ]

    const router = createBrowserRouter([
        ...routesForPublic,
        ...routesForAuthenticatedOnly,
        ...routesForNotAuthenticatedOnly,
    ])

    return <RouterProvider router={router} />
}

export default Routes;