import {FieldValues, useForm} from "react-hook-form";

import {useAuth} from "../../app/provider/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";
import {IJwtTokens, IUser} from "./types.ts";
import {useMutation} from "@tanstack/react-query";
import {apiAxios} from "../../shared/config.ts";

const Authorization = () => {

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const { setAccessToken, setRefreshToken } = useAuth();
    const navigate = useNavigate();

    interface MutationProps {
        newUser: IUser;
        url: string;
    }

    const sendUser = useMutation({
        mutationFn: ({newUser, url}: MutationProps): Promise<IJwtTokens> =>
            apiAxios.post(`/auth/${url}`, {
                email: newUser.email,
                password: newUser.password,
            }),
        onSuccess: (data) => {
            setAccessToken(data.accessToken)
            setRefreshToken(data.refreshToken)
            navigate("/main")
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const onSubmit = (data: FieldValues) => {
        console.log("auth");
        sendUser.mutate(
            {newUser: {
                email: data.email,
                password: data.password},
            url: "authenticate"})
    }

    return (
        <>
            <div>Авторизация</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("email", {
                        required: "error",
                    })}
                    placeholder="Email"
                />
                {errors.email && <div>Email is wrong</div>}
                <input
                    {...register("password", {
                        required: "error",
                    })}
                    //type="password"
                    placeholder="Password"
                />
                {errors.password && <div>Password is wrong</div>}
                <div>
                    <button
                        disabled={sendUser.isPending}
                        type="submit"
                    >{sendUser.isPending ? 'Entering...' : 'Log in'}</button>
                </div>

            </form>
        </>
    )
}

export default Authorization;