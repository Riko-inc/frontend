import { createUseStyles } from 'react-jss';
import {ITheme} from "./themes.ts";


export const useGlobalStyles = createUseStyles((theme: ITheme) => ({
    '@global': {
        '*, *::before, *::after': {
            boxSizing: theme.global.boxSizing,
        },
        body: {
            margin: 0,
            padding: 0,
            fontFamily: theme.typography.fontFamily,
            fontWeight: theme.typography.fontWeight,
            backgroundColor: theme.colors.background,
            // color: theme.colors.text,
        },
        h1: {
            margin: theme.spacing.nm,
        },
        '::selection': {
            backgroundColor: "#0236a0",
            color: 'inherit',
        },
        '::-moz-selection': {
            backgroundColor: '#0236a0',
            color: 'inherit',
        },
    },
}));
