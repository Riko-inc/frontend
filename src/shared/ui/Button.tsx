import { Button as HeadlessButton } from "@headlessui/react"
import {createUseStyles} from "react-jss";
import {ITheme} from "../styles/themes.ts";
import {ButtonHTMLAttributes, FC, ReactNode} from "react";

interface StyleProps {
    fontSize?: ButtonProps['fontSize'];
    minWidth?: ButtonProps['minWidth'];
}

const useStyles = createUseStyles((theme: ITheme) => ({
    button: ({ fontSize, minWidth }: StyleProps) => {
        const baseFontSize = fontSize || theme.typography.fontSize.medium;

        const verticalPadding = `calc(${baseFontSize} * 0.5)`;
        const horizontalPadding = `calc(${baseFontSize} * 0.7)`;

        return {
            backgroundColor: theme.colors.primary,
            color: "white",
            cursor: "pointer",
            border: "none",
            borderRadius: `calc(${baseFontSize} * 0.5)`,
            transition: "all 0.2s ease",

            "&:hover": {
                backgroundColor: theme.colors.secondary,
            },
            "&:focus": {
                outline: `1px solid ${theme.colors.neutral}`,
            },

            fontSize: baseFontSize,
            padding: `${verticalPadding} ${horizontalPadding}`,
            margin: theme.spacing.xs,
            minWidth: minWidth || "fit-content",
        };
    },
}));


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode
    fontSize?: string;
    minWidth?: string;
}

const Button: FC<ButtonProps> = ({children, minWidth, fontSize, ...props}) => {
    const classes = useStyles({fontSize, minWidth});

    return (
        <>
            <button className={classes.button} {...props}>{children}</button>
        </>
    );
};

export default Button;