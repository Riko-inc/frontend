import {useAuth} from "../app/provider/AuthProvider.tsx";

const Main = () => {

    const {accessToken} = useAuth();

    const con = () => {
        console.log(accessToken);
    }

    return (
        <>
            <div>Main</div>
            <button onClick={() => console.log(accessToken)}>Токены</button>
        </>
    )
}

export default Main;