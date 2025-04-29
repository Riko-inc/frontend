import {useNavigate} from "react-router-dom";
import {ROUTES} from "../../app";

const Page404 = () => {

    const navigate = useNavigate();

    return (
        <>
            <p>404 Not Found</p>
            <button onClick={() => navigate(ROUTES.MAIN)}>На главную</button>
        </>
    );
}

export default Page404;