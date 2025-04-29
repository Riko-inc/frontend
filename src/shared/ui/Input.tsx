import {createUseStyles} from "react-jss";
import {ITheme} from "../styles/themes.ts";
import {FC} from "react";
import {useFormContext} from "react-hook-form";
import clsx from 'clsx';

interface StyleProps {
    fontSize?: InputProps['fontSize'];
    minWidth?: InputProps['minWidth'];
}

const useStyles = createUseStyles((theme: ITheme) => ({
    input: ({ fontSize, minWidth }: StyleProps) => {
        const baseFontSize = fontSize || theme.typography.fontSize.medium;

        return {
            backgroundColor: theme.colors.background,
            color: theme.colors.text,
            transition: "all 0.2s ease",
            "&::placeholder": {
                color: theme.colors.neutral,
                opacity: 1,
            },

            border: `1px solid ${theme.colors.neutral}`,
            borderRadius: "0.5em",
            "&:hover": {
                boxShadow: `0 0 5px ${theme.colors.neutral}`,
            },
            "&:focus": {
                outline: "none",
            },

            fontSize: baseFontSize,
            margin: theme.spacing.sm,
            padding: "0.75em 1em",
            minWidth: minWidth || "fit-content",
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.fontWeight,
            boxSizing: 'border-box'

        }
    }
}));

interface InputProps {
    placeholder: string
    name: string
    required?: boolean | string;
    fontSize?: string
    minWidth?: string
    className?: string
}

const Input: FC<InputProps> = ({placeholder, fontSize, minWidth, name, required, className}) => {
    const classes = useStyles({ fontSize, minWidth });
    const { register, formState: { errors } } = useFormContext();

    return (
        <>
            <input
                className={clsx(classes.input, className)}
                placeholder={placeholder}
                {...register(name, {required})}/>
            {errors[name] && <div>{name} is wrong</div>}
        </>
    );
};

export default Input;