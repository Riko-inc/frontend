import { createUseStyles } from "react-jss";
import { ITheme } from "../styles/themes.ts";
import { FC, ReactNode } from "react";
import { Link as RouterLink } from "react-router-dom";

const useStyles = createUseStyles((theme: ITheme) => ({
    link: {
        color: theme.colors.neutral,
        cursor: "pointer",
        border: "none",
        transition: "all 0.2s ease",
        '&:hover': {
            textDecoration: 'underline',
        },
        fontSize: theme.typography.fontSize.small,
        margin: theme.spacing.xs,
    }
}));

interface LinkProps {
    children: ReactNode
    to: string
    onClick?: () => void;
}

const Link: FC<LinkProps> = ({ children, to, onClick, ...props }) => {
    const classes = useStyles();

    return (
        <RouterLink
            className={classes.link}
            to={to}
            onClick={onClick}
            {...props}
        >
            {children}
        </RouterLink>
    );
};

export default Link;