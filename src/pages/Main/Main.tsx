import {useAuth} from "../../app/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../app/routes/Routes.tsx";
import {Button} from "@headlessui/react";
import Navbar from "../../widgets/navbar/Navbar.tsx";




const Main = () => {

    const { clearTokens } = useAuth();
    const navigate = useNavigate();



    return (
        <>
            <Navbar />
            <div>Main</div>
            <button onClick={() => clearTokens()}>Выйти из аккаунта</button>
            <Button>Кнопка</Button>

            <button onClick={() => navigate(ROUTES.TODOLIST)}>TodoList</button>
            {/*<button onClick={() => navigate(ROUTES.TEST)}>TokenTest</button>*/}
        </>
    )
}

export default Main;