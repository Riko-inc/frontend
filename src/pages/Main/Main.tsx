import {useAuth} from "../../app/provider/AuthProvider.tsx";


const Main = () => {

    const { clearTokens } = useAuth();

    return (
        <>
            <div>Main</div>
            {/*<button onClick={() => console.log(accessToken)}>Токены</button>*/}
            <button onClick={() => clearTokens()}>Выйти из аккаунта</button>
        </>
    )
}

export default Main;