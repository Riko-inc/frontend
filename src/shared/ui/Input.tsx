import { Input as HeadlessInput } from "@headlessui/react"
import {createUseStyles} from "react-jss";
import {ITheme} from "../styles/themes.ts";
import {FC} from "react";
import {useFormContext} from "react-hook-form";

interface StyleProps {
    fontSize?: InputProps['fontSize'];
    minWidth?: InputProps['minWidth'];
}

const useStyles = createUseStyles((theme: ITheme) => ({
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
    const classes = useStyles({ fontSize, minWidth });
    const { register, formState: { errors } } = useFormContext();

    return (
        <>
            <HeadlessInput
                className={classes.input}
                placeholder={placeholder}
                {...register(name, {required})}/>
            {errors[name] && <div>{name} is wrong</div>}
        </>
    );
};

export default Input;