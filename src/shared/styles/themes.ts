export interface ITheme {
    colors: {
        primary: string;
        secondary: string;
        neutral: string;
        background: string;
        text: string;
        focus: string;
    };
    typography: {
        fontFamily: string;
        fontWeight: string;
        fontSize: {
            extraSmall: string;
            small: string
            medium: string
            large: string
            title: string
            headline: string
        },
    };
    global: {
        boxSizing: string;
    };
    spacing: {
        xs: string
        sm: string
        nm: string
        md: string
        lg: string
        xl: string
    },
}

export const lightTheme: ITheme = {
    colors: {
        primary: 'blue', //цвет
        secondary: 'darkblue', //темносиний
        neutral: 'lightgray', //серый
        background: 'white', //белый
        text: 'black', //черный
        focus: 'black'
    },
    typography: {
        fontFamily: 'Open Sans, sans-serif',
        fontWeight: 'normal',
        fontSize: {
            extraSmall: '0.75rem',// 12px
            small: '0.875rem',   // 14px
            medium: '1rem',      // 16px
            large: '1.25rem',    // 20px
            title: '1.5rem',     // 24px
            headline: '2rem',    // 32px
        },
    },
    global: {
        boxSizing: 'border-box'
    },
    spacing: {
        xs: '4px',
        sm: '8px',
        nm: '12px',
        md: '16px',
        lg: '24px',
        xl: '32px',
    },
};

export const darkTheme: ITheme = {
    ...lightTheme,
    colors: {
        primary: 'blue', //цвет
        secondary: 'darkblue', //темносиний
        neutral: 'lightgray', //серый
        background: 'white', //белый
        text: 'black', //черный
        focus: 'black'
    }
};