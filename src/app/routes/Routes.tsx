import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {RouteForNotAuthenticated} from "./RouteForNotAuthenticated.tsx";
import Authorization from "../../pages/Login/Authorization.tsx";
import Registration from "../../pages/Login/Registration.tsx";
import Main from "../../pages/Main/Main.tsx";



const Routes = () => {

    const routesForPublic = [
        {
            path: "/frontend/about-us",
            element: <div>About us</div>
        }
    ]

    const routesForAuthenticatedOnly = [
        {

            element: <ProtectedRoute />,
            children: [
                {
                    path: "/frontend/",
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
                    path: "/frontend/login",
                    element: <Authorization />

                },
                {
                    path: "/frontend/sign-up",
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