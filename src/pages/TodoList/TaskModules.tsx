import {Collapsible} from "radix-ui";
import {IFilterValues, TStatus} from "../../shared/types.ts";
import TaskList from "./TaskList.tsx";
import {useState} from "react";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import {flexRow} from "../../shared/styles/mixins.ts";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";

const useStyles = createUseStyles((theme: ITheme) => ({
    Container: {
        ...flexRow
    },
    Title: {
        ...flexRow,
        border: `1px solid ${theme.colors.neutral}`,
        cursor: "pointer",

        backgroundColor: theme.colors.background,
        color: theme.colors.text,

        fontSize: '18px',
        fontWeight: 500,
        height: '55px',
        display: 'flex',
        gap: '7px',
        width: '100%',
        padding: '0px 20px',
    }
}))

interface TaskModulesProps {
    filters: IFilterValues,
    statusKey: string,
    statusLabel: string
}

const TaskModules = ({filters, statusKey, statusLabel}: TaskModulesProps) => {
    const classes = useStyles();
    const [open, setOpen] = useState(true);

    const noStatusChosen = filters.status.length === 0


    return (
        <>
            <Collapsible.Root open={open} onOpenChange={setOpen}>
                <div className={classes.Container}>

                    <Collapsible.Trigger asChild>
                        <span className={classes.Title}>
                            {statusLabel}
                            {open ? <ChevronUpIcon /> : <ChevronDownIcon /> }
                        </span>
                    </Collapsible.Trigger>
                </div>
                <Collapsible.Content>
                    {(noStatusChosen || filters.status.includes(statusKey as TStatus)) &&
                        <TaskList filters={{
                            ...filters,
                            status: [statusKey as TStatus]
                        }} />
                    }
                </Collapsible.Content>
            </Collapsible.Root>
        </>
    );
};

export default TaskModules;