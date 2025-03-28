import {FieldValues, useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {apiAxios} from "../../shared/config.ts";
import {useAuth} from "../../app/provider/AuthProvider.tsx";
import {useNavigate} from "react-router-dom";

const Registration = () => {

    const { setAccessToken, setRefreshToken } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();


    interface IUser {
        email: string;
        password: string;
    }

    interface IJwtTokens {
        accessToken: string;
        refreshToken: string;
    }

    const mutation = useMutation({
        mutationFn: (newUser: IUser): Promise<IJwtTokens> =>
            apiAxios.post("/auth/register", {
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
        const newUser: IUser = {
            email: data.email,
            password: data.password
        }
        mutation.mutate(newUser)
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
                            disabled={mutation.isPending}
                            type="submit"
                    >{mutation.isPending ? 'Creating...' : 'Sign up'}</button>
                </div>

            </form>
        </>
    )
}

export default Registration;