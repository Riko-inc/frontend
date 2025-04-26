
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

    return (
        <div className={classes.checkbox}>
            <input type="checkbox" value={value} {...register(name)} />
            <label className={classes.label}>{label}</label>
        </div>
        // <Controller
        //     name={name}
        //     control={control}
        //     render={({ field }) => (
        //         <HeadlessCheckbox
        //             className={classes.checkbox}
        //             {...field}
        //             value={value}
        //         >
        //             {({ checked }) =>
        //                 checked ? (
        //                     <>
        //                         <MdOutlineCheckBox size={15} />
        //                         <label className={classes.label}>{label}</label>
        //                     </>
        //                 ) : (
        //                     <>
        //                         <MdOutlineCheckBoxOutlineBlank size={15} />
        //                         <label className={classes.label}>{label}</label>
        //                     </>
        //                 )
        //             }
        //         </HeadlessCheckbox>
        //     )}
        // />
    );
};

export default Checkbox;