import {createUseStyles} from "react-jss";
import {flexCenter, flexRow} from "../../shared/styles/mixins.ts";
import {ITheme} from "../../shared/styles/themes.ts";
import { CgProfile } from "react-icons/cg";
import { TbGridDots } from "react-icons/tb";
import {ROUTES} from "../../app";
import {useNavigate} from "react-router-dom";
import CreateTaskForm from "../../pages/TodoList/CreateTaskForm.tsx";
import FilterPopover from "./FilterPopover.tsx";

const useStyles = createUseStyles((theme: ITheme) => ({
    container: {
        ...flexRow,
        height: '60px',
        border: `1px solid ${theme.colors.neutral}`,

        justifyContent: 'space-between',
        padding: theme.spacing.sm,
    },
    row: {
        ...flexRow,
    },
    title: {
        fontSize: theme.typography.fontSize.title,
        fontWeight: 600,
        margin: theme.spacing.xs,
        cursor: "pointer",
    },
    icon: {
        cursor: 'pointer',
        margin: theme.spacing.sm,
        ...flexCenter("row")
    }
}));



const Navbar = () => {
    const classes = useStyles();
    const navigate = useNavigate();


    return (
        <>
            <div className={classes.container}>
                <div className={classes.row}>
                    <div className={classes.icon}>
                        <TbGridDots size={30} />
                    </div>
                    <div className={classes.title} onClick={() => navigate(ROUTES.MAIN)}>
                        Teapo
                    </div>
                </div>
                <div className={classes.row}>
                    <FilterPopover />
                    <CreateTaskForm />
                    <div className={classes.icon}>
                        <CgProfile size={35} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;