import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {api, useAuth, ROUTES} from "../../app";
import {useNavigate} from "react-router-dom";
import {IUser} from "./types.ts";
import {useMutation} from "@tanstack/react-query";
import {API_ENDPOINTS} from "../../shared/config.ts";
import {createUseStyles} from "react-jss";
import {flexCenter} from "../../shared/styles/mixins.ts";
import Input from "../../shared/ui/Input.tsx";
import PasswordInput from "../../shared/ui/PasswordInput.tsx";
import Button from "../../shared/ui/Button.tsx";
import Link from "../../shared/ui/Link.tsx";


const useStyles = createUseStyles(() => ({
    container: {
        ...flexCenter("column"),
        height: '95vh',
    },
    form: {
        ...flexCenter("column"),
    }
}));

const Registration = () => {

    const classes = useStyles();
    const methods = useForm();

    const { setTokens } = useAuth();
    const navigate = useNavigate();



    const sendUserMutation = useMutation({
        mutationFn: (newUser: IUser) =>
            api.post(API_ENDPOINTS.SIGNUP, {
                email: newUser.email,
                password: newUser.password,
            }),
        onSuccess: async (data) => {
            setTokens(data.data);
            navigate(ROUTES.MAIN, { replace: true });
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
        <div className={classes.container}>
            <h1>Регистрация</h1>
            <FormProvider {...methods}>
                <form className={classes.form} onSubmit={methods.handleSubmit(onSubmit)}>
                    <Input name="email" placeholder="Почта" minWidth="250px" required />
                    <PasswordInput name="password" placeholder="Пароль" minWidth="250px" required />
                    <Button
                        disabled={sendUserMutation.isPending}
                        type="submit"
                        minWidth="180px"
                    >{sendUserMutation.isPending ? 'Создание...' : 'Зарегистрироваться'}</Button>
                </form>
            </FormProvider>
            <Link onClick={() => navigate(ROUTES.LOGIN)}>Авторизоваться</Link>
        </div>
    )
}

export default Registration;