import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {api, useAuth} from "../../app/contexts/AuthContext.tsx";
import {useNavigate} from "react-router-dom";
import {IUser} from "./types.ts";
import {useMutation} from "@tanstack/react-query";
import {ROUTES} from "../../app/routes/Routes.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import {createUseStyles} from "react-jss";
import {flexCenter} from "../../shared/styles/mixins.ts";

import Input from "../../shared/ui/Input.tsx";
import PasswordInput from "../../shared/ui/PasswordInput.tsx";
import Link from "../../shared/ui/Link.tsx";
import { Button as RadixButton } from "@radix-ui/themes";
import Button from "../../shared/ui/Button.tsx";


const useStyles = createUseStyles(() => ({
    container: {
        ...flexCenter("column"),
        height: '95vh',
    },
    form: {
        ...flexCenter("column"),
    },
    button: {
        fontWeight: "bold",

    }
}));

const Authorization = () => {
    const classes = useStyles();

    const methods = useForm();

    const { setTokens } = useAuth();
    const navigate = useNavigate();

    const sendUserMutation = useMutation({
        mutationFn: (newUser: IUser) =>
            api.post(API_ENDPOINTS.LOGIN, {
                email: newUser.email,
                password: newUser.password,
            }),
        onSuccess: async (data) => {
            setTokens(data.data);
            navigate(ROUTES.MAIN, { replace: true });
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
                password: data.password
            },
        )
    }

    return (
        <div className={classes.container}>
            <h1>Авторизация</h1>
            <FormProvider {...methods}>
                <form className={classes.form} onSubmit={methods.handleSubmit(onSubmit)}>
                    <Input name="email" placeholder="Почта" minWidth="250px" required />
                    <PasswordInput name="password" placeholder="Пароль" minWidth="250px" required />
                    <Button
                        disabled={sendUserMutation.isPending}
                        type="submit"
                        minWidth="150px"
                    >{sendUserMutation.isPending ? 'Вход...' : 'Авторизоваться'}</Button>
                </form>
            </FormProvider>
            <Link onClick={() => navigate(ROUTES.SIGNUP)}>Зарегистрироваться</Link>
        </div>
    )
}

export default Authorization;