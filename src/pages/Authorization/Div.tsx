import {useAuth} from "../../app/provider/AuthProvider.tsx";
import {useEffect} from "react";

function Div() {
    const { accessToken, setAccessToken } = useAuth();

    useEffect(() => {
        setAccessToken("123412");
    }, []);

    return (
        <>
            <div>{accessToken}</div>
        </>

    )
}

export default Div