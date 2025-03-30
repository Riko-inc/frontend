import {FieldValues, useForm} from "react-hook-form";
import {api, useAuth} from "../../app/provider/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";
import {IUser} from "./types.ts";
import {useMutation} from "@tanstack/react-query";


const Registration = () => {

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    const { setTokens } = useAuth();
    const navigate = useNavigate();



    const sendUserMutation = useMutation({
        mutationFn: (newUser: IUser) =>
            api.post("/auth/register", {
                email: newUser.email,
                password: newUser.password,
            }),
        onSuccess: async (data) => {
            setTokens(data.data);
            navigate("/frontend/main", { replace: true });
            console.log("tokens", data)
            //и еще проблема здесь
        },
        onError: (error) => {
            console.error(error);
        }
    });


    const onSubmit = (data: FieldValues) => {
        console.log("register");
        sendUserMutation.mutate(
            {
                email: data.email,
                password: data.password},
        )
    }

    return (
        <>
            <div>Регистрация</div>
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
                    >{sendUserMutation.isPending ? 'Creating...' : 'Sign up'}</button>
                </div>

            </form>
            <button onClick={() => navigate('/login')}>Перейти в авторизацию</button>
        </>
    )
}

export default Registration;