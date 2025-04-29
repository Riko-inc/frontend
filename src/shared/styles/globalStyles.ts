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
            color: theme.colors.text,
        },
        h1: {
            margin: theme.spacing.nm,
        },
        '::selection': {
            backgroundColor: theme.colors.primary,
            color: theme.colors.background,
        },
        '::-moz-selection': {
            backgroundColor: theme.colors.primary,
            color: theme.colors.background,
        },
        '&::-webkit-scrollbar': {
            display: 'none',
        }
    },
}));
