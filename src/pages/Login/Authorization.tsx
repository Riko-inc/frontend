import {FieldValues, useForm} from "react-hook-form";

import {api, useAuth} from "../../app/provider/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";
import {IUser} from "./types.ts";
import {useMutation} from "@tanstack/react-query";

const Authorization = () => {

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const { setTokens } = useAuth();
    const navigate = useNavigate();

    const sendUserMutation = useMutation({
        mutationFn: (newUser: IUser) =>
            api.post("/auth/api/v1/auth/authenticate", {
                email: newUser.email,
                password: newUser.password,
            }),
        onSuccess: async (data) => {
            setTokens(data.data);
            navigate("/", { replace: true });
            console.log("tokens", data)

        },
        onError: (error) => {
            console.error(error);
        }
    });

    const onSubmit = (data: FieldValues) => {
        console.log("auth");
        sendUserMutation.mutate(
            {
                email: data.email,
                password: data.password},
        )
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
                        disabled={sendUserMutation.isPending}
                        type="submit"
                    >{sendUserMutation.isPending ? 'Entering...' : 'Login'}</button>
                </div>

            </form>
            <button onClick={() => navigate('/sign-up')}>Перейти в регистрацию</button>
        </>
    )
}

export default Authorization;