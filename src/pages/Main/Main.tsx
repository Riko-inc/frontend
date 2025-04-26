import {useAuth} from "../../app/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../app/routes/Routes.tsx";




const Main = () => {

    const { clearTokens } = useAuth();
    const navigate = useNavigate();



    return (
        <>
            <div>Main</div>
            <p>Coming soon...</p>
            <button onClick={() => clearTokens()}>Выйти из аккаунта</button>


            <button onClick={() => navigate(ROUTES.TODOLIST)}>TodoList</button>
            {/*<button onClick={() => navigate(ROUTES.TEST)}>TokenTest</button>*/}
        </>
    )
}

export default Main;