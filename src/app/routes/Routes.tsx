import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {RouteForNotAuthenticated} from "./RouteForNotAuthenticated.tsx";
import Authorization from "../../pages/Log in/Authorization.tsx";
import Registration from "../../pages/Log in/Registration.tsx";
import Main from "../../pages/Main/Main.tsx";



const Routes = () => {

    const routesForPublic = [
        {
            path: "/about-us",
            element: <div>About us</div>
        }
    ]

    const routesForAuthenticatedOnly = [
        {

            element: <ProtectedRoute />,
            children: [
                {
                    path: "/frontend/main",
                    element: <Main />,
                }
            ]
        }
    ]

    const routesForNotAuthenticatedOnly = [
        {

            element: <RouteForNotAuthenticated />,
            children: [
                {
                    path: "/login",
                    element: <Authorization />

                },
                {
                    path: "/sign-up",
                    element: <Registration />,
                }
            ]
        }

    ]

    const router = createBrowserRouter([
        ...routesForPublic,
        ...routesForNotAuthenticatedOnly,
        ...routesForAuthenticatedOnly,
        {
            path: "*",
            element: <div>404 Not Found</div>
        }
    ])

    return <RouterProvider router={router} />
}

export default Routes;