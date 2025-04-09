import {ProtectedRoute} from "./ProtectedRoute.tsx";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {RouteForNotAuthenticated} from "./RouteForNotAuthenticated.tsx";
import Authorization from "../../pages/Login/Authorization.tsx";
import Registration from "../../pages/Login/Registration.tsx";
import Main from "../../pages/Main/Main.tsx";
import Todolist from "../../pages/TodoList/Todolist.tsx";
import Page404 from "../../pages/Page404/Page404.tsx";
import TokenTestPage from "../../pages/Main/TokenTestPage.tsx";


const envVar: string = "/frontend"

export const ROUTES = {
    MAIN: envVar + "/",
    ABOUT: envVar + "/about",
    LOGIN: envVar + "/login",
    SIGNUP: envVar + "/sign-up",
    TODOLIST: envVar + "/todolist",
    TEST: envVar + "/test",
};

const Routes = () => {

    const routesForPublic = [
        {
            path: ROUTES.ABOUT,
            element: <div>About</div>
        },
        {
            path: ROUTES.TEST,
            element: <TokenTestPage />
        }
    ]

    const routesForAuthenticatedOnly = [
        {

            element: <ProtectedRoute />,
            children: [
                {
                    path: ROUTES.MAIN,
                    element: <Main />,
                },
                {
                    path: ROUTES.TODOLIST,
                    element: <Todolist />,
                }
            ]
        }
    ]

    const routesForNotAuthenticatedOnly = [
        {

            element: <RouteForNotAuthenticated />,
            children: [
                {
                    path: ROUTES.LOGIN,
                    element: <Authorization />

                },
                {
                    path: ROUTES.SIGNUP,
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
            element: <Page404 />
        }
    ])

    return <RouterProvider router={router} />
}

export default Routes;