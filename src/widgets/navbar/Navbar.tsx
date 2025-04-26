import {createUseStyles} from "react-jss";
import {flexCenter, flexRow} from "../../shared/styles/mixins.ts";
import {ITheme} from "../../shared/styles/themes.ts";
import { CgProfile } from "react-icons/cg";
import { TbGridDots } from "react-icons/tb";
import Filters from "./Filters.tsx";
import TaskDialog from "../../pages/TodoList/TaskDialog.tsx";
import {ROUTES} from "../../app/routes/Routes.tsx";
import {useNavigate} from "react-router-dom";

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
                    <p className={classes.title}>Teapo</p>
                </div>
                <div className={classes.row}>
                    <button onClick={() => navigate(ROUTES.MAIN)}>Вернуться на главную страницу</button>
                    <TaskDialog type="Create" />
                    <Filters />
                    <div className={classes.icon}>
                        <CgProfile size={35} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Navbar;