import {FormProvider, useForm} from "react-hook-form";
import {useAuth, ROUTES} from "../../app";
import {useNavigate} from "react-router-dom";
import {IUser} from "./types.ts";
import {createUseStyles} from "react-jss";
import {flexCenter} from "../../shared/styles/mixins.ts";

import Input from "../../shared/ui/Input.tsx";
import PasswordInput from "../../shared/ui/PasswordInput.tsx";
import Link from "../../shared/ui/Link.tsx";
import Button from "../../shared/ui/Button.tsx";
import {useLoginUser} from "../../api/authApi.ts";


const useStyles = createUseStyles(() => ({
    container: {
        ...flexCenter("column"),
        height: '95vh',
    },
    form: {
        ...flexCenter("column"),
    }
}));

const Authorization = () => {
    const classes = useStyles();

    const methods = useForm<IUser>();

    const { setTokens } = useAuth();
    const navigate = useNavigate();
    const loginUser = useLoginUser()

    const onSubmit = async (data: IUser) => {
        try {
            const res = await loginUser.mutateAsync(data)
            setTokens(res.data);
            navigate(ROUTES.MAIN, { replace: true });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className={classes.container}>
            <h1>Авторизация</h1>
            <FormProvider {...methods}>
                <form className={classes.form} onSubmit={methods.handleSubmit(onSubmit)}>
                    <Input name="email" placeholder="Почта" minWidth="250px" required />
                    <PasswordInput name="password" placeholder="Пароль" minWidth="250px" required />
                    <Button
                        disabled={loginUser.isPending}
                        type="submit"
                        minWidth="150px"
                    >{loginUser.isPending ? 'Вход...' : 'Авторизоваться'}</Button>
                </form>
            </FormProvider>
            {/*<Link onClick={() => navigate(ROUTES.SIGNUP)}>Зарегистрироваться</Link>*/}
            <Link to={ROUTES.SIGNUP}>Зарегистрироваться</Link>
        </div>
    )
}

export default Authorization;