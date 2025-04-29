import {createUseStyles} from "react-jss";
import {ITheme} from "../styles/themes.ts";
import {ButtonHTMLAttributes, FC, ReactNode} from "react";
import clsx from "clsx";

interface StyleProps {
    fontSize?: ButtonProps['fontSize'];
    minWidth?: ButtonProps['minWidth'];
}

const useStyles = createUseStyles((theme: ITheme) => ({
    button: ({ fontSize, minWidth }: StyleProps) => {
        const baseFontSize = fontSize || theme.typography.fontSize.medium;

        return {
            backgroundColor: theme.colors.primary,
            color: "white",
            cursor: "pointer",
            border: "none",
            borderRadius: "0.5em",
            transition: "all 0.2s ease",

            "&:hover": {
                backgroundColor: theme.colors.secondary,
            },
            "&:focus": {
                outline: `1px solid ${theme.colors.neutral}`,
            },

            fontSize: baseFontSize,
            padding: "0.5em 0.7em",
            margin: theme.spacing.xs,
            minWidth: minWidth || "fit-content",
        };
    },
}));


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    fontSize?: string;
    minWidth?: string;
    className?: string
}

const Button: FC<ButtonProps> = ({children, minWidth, fontSize, className, ...props}) => {
    const classes = useStyles({fontSize, minWidth});

    return (
        <>
            <button className={clsx(classes.button, className)}
                    {...props}>{children}</button>
        </>
    );
};

export default Button;