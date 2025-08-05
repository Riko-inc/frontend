import {FormProvider, useForm} from "react-hook-form";
import {useAuth, ROUTES} from "../../app";
import {useNavigate} from "react-router-dom";
import {IUser} from "./types.ts";
import {createUseStyles} from "react-jss";
import {flexCenter} from "../../shared/styles/mixins.ts";
import Input from "../../shared/ui/Input.tsx";
import PasswordInput from "../../shared/ui/PasswordInput.tsx";
import Button from "../../shared/ui/Button.tsx";
import Link from "../../shared/ui/Link.tsx";
import {useSignUpUser} from "../../api/authApi.ts";


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
    const methods = useForm<IUser>();

    const { setTokens } = useAuth();
    const navigate = useNavigate();

    const sighUpUser = useSignUpUser()

    const onSubmit = async (data: IUser) => {
        try {
            const res = await sighUpUser.mutateAsync(data)
            setTokens(res.data);
            navigate(ROUTES.MAIN, { replace: true });
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className={classes.container}>
            <h1>Регистрация</h1>
            <FormProvider {...methods}>
                <form className={classes.form} onSubmit={methods.handleSubmit(onSubmit)}>
                    <Input name="email" placeholder="Почта" minWidth="250px" required />
                    <PasswordInput name="password" placeholder="Пароль" minWidth="250px" required />
                    <Button
                        disabled={sighUpUser.isPending}
                        type="submit"
                        minWidth="180px"
                    >{sighUpUser.isPending ? 'Создание...' : 'Зарегистрироваться'}</Button>
                </form>
            </FormProvider>
            {/*<Link onClick={() => navigate(ROUTES.LOGIN)}>Авторизоваться</Link>*/}
            <Link to={ROUTES.LOGIN}>Авторизоваться</Link>
        </div>
    )
}

export default Registration;