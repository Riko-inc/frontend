
import {createUseStyles} from "react-jss";
import {ITheme} from "../styles/themes.ts";
import {flexCenter} from "../styles/mixins.ts";
import {FC} from "react";
import {useFormContext} from "react-hook-form";


const useStyles = createUseStyles((theme: ITheme) => ({
    checkbox: {
        ...flexCenter("row"),
        gap: '3px',
        width: '100%',
        display: "flex",
        justifyContent: "start",
        borderRadius: "6px",
        padding: `2px 5px`,
        "&:hover": {
            backgroundColor: theme.colors.neutral,
        },
    },
    input: {

    },
    label: {
        padding: 0,
        margin: 0,
        display: "flex",
        alignItems: "center",
        fontSize: theme.typography.fontSize.small
    }
}));

interface CheckboxProps {
    label: string;
    name: string;
    value: string;

}

const Checkbox: FC<CheckboxProps> = ({label, name, value}) => {
    const classes = useStyles();
    const { register } = useFormContext();
    const inputId = `${name}-${value}`

    return (
        <label htmlFor={inputId} className={classes.checkbox}>
            <input
                id={inputId}
                type="checkbox"
                className={classes.input}
                value={value}
                {...register(name)}
            />
            <span className={classes.label}>{label}</span>
        </label>
    );
};

export default Checkbox;