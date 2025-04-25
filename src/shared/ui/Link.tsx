import {createUseStyles} from "react-jss";
import {ITheme} from "../styles/themes.ts";
import {FC, LinkHTMLAttributes, ReactNode} from "react";

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

interface LinkProps extends LinkHTMLAttributes<HTMLAnchorElement> {
    children: ReactNode,
}

const Link: FC<LinkProps> = ({children, ...props}) => {
    const classes = useStyles();

    return (
        <>
            <a className={classes.link} {...props}>{children}</a>
        </>
    );
};

export default Link;