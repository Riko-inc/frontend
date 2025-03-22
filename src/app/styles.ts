import { createUseStyles } from "react-jss";


const styles = {
    button: {
        backgroundColor: "red",
        border: "none",
    },
    redButton: {
        backgroundColor: "red",
        border: "none",
    },
};


export const useStyles = createUseStyles(styles);
