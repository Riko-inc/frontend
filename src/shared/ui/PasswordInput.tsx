import { Input as HeadlessInput } from "@headlessui/react"
import {createUseStyles} from "react-jss";
import {ITheme} from "../styles/themes.ts";
import {FC, useState} from "react";
import {useFormContext} from "react-hook-form";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import {flexCenter} from "../styles/mixins.ts";

interface StyleProps {
    fontSize?: InputProps['fontSize'];
    minWidth?: InputProps['minWidth'];
}

const useStyles = createUseStyles((theme: ITheme) => ({
    inputContainer: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
    },
    input: ({ fontSize, minWidth }: StyleProps) => {
        const baseFontSize = fontSize || theme.typography.fontSize.medium;

        const verticalPadding = `calc(${baseFontSize} * 0.75)`;
        const horizontalPadding = `calc(${baseFontSize} * 1)`;

        return {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            transition: "all 0.2s ease",
            "&::placeholder": {
                color: theme.colors.neutral,
                opacity: 1,
            },

            border: `1px solid ${theme.colors.neutral}`,
            borderRadius: `calc(${baseFontSize} * 0.5)`,
            "&:hover": {
                boxShadow: `0 0 5px ${theme.colors.neutral}`,
            },
            "&:focus": {
                outline: "none",
            },

            fontSize: baseFontSize,
            margin: theme.spacing.sm,
            padding: `${verticalPadding} ${horizontalPadding}`,
            minWidth: minWidth || "fit-content",
        }
    },
    icon: {
        color: theme.colors.neutral,
        position: 'absolute',
        right: theme.spacing.md,
        margin: theme.spacing.xs,
        cursor: 'pointer',
        ...flexCenter("row")
    }
}));

interface InputProps {
    placeholder: string
    name: string
    required?: boolean | string;
    fontSize?: string
    minWidth?: string
}

const Input: FC<InputProps> = ({placeholder, fontSize, minWidth, name, required}) => {
    const classes = useStyles({fontSize, minWidth});
    const [passwordIsHidden, setPasswordIsHidden] = useState(true);
    const { register, formState: { errors } } = useFormContext();

    const showPassword = () => {
        setPasswordIsHidden((prev) => !prev);
    }

    return (
        <div className={classes.inputContainer}>
            <HeadlessInput
                className={classes.input}
                placeholder={placeholder}
                type={passwordIsHidden ? 'password' : 'text'}
                {...register(name, {required})}
            />
            <div className={classes.icon} onClick={showPassword}>
                {passwordIsHidden ? <FaRegEyeSlash /> : <FaRegEye />}
            </div>
            {errors[name] && <div>{name} is wrong</div>}
        </div>
    );
};

export default Input;