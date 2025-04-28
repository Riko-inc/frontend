import {ITaskResponse} from "../../shared/types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app/contexts/AuthContext.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import {useEffect, useRef} from "react";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import {flexRow} from "../../shared/styles/mixins.ts";
import Select from "./Select.tsx";
import {useUsers} from "./lib.ts";
import Button from "../../shared/ui/Button.tsx";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import TaskDialog from "./TaskDialog.tsx";
import {format} from "date-fns";


const useStyles = createUseStyles((theme: ITheme) => ({
    taskContainer: {
        ...flexRow,
        border: `1px solid ${theme.colors.neutral}`,
        cursor: "pointer",
        // "&:hover": {
        //     backgroundColor: theme.colors.neutral,
        // },

        height: '50px',
        display: 'flex',
        justifyContent: 'space-between',

        padding: '10px',

    },
    title: {
        width: "100%",
    },
    number: {
        minWidth: '50px',
        margin: '0 20px',

        fontSize: theme.typography.fontSize.small,
        color: theme.colors.primary,
    },
    row: {
        ...flexRow,
    },

}));


const Task = ({ task }: {task: ITaskResponse}) => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const formattedTask = {
        ...task,
        assignedToUserId: task.assignedToUserId ? String(task.assignedToUserId) : "null",
    }
    const mainForm = useForm<ITaskResponse>({
        defaultValues: formattedTask,
    })
    const { control } = mainForm
    // const watchedValues = useWatch({ control });
    const formValues = useWatch<ITaskResponse>({ control: mainForm.control });
    // const [error, setError] = useState(false)

    useEffect(() => {
        if (task) {
            mainForm.reset(formattedTask);
        }
    }, [task])


    const editTaskMutation = useMutation({
        mutationFn: (newTask: ITaskResponse) => {
            const formattedDate = newTask.dueTo ? format(newTask.dueTo, 'dd-MM-yyyy HH:mm') : null;
            return api.put(API_ENDPOINTS.EDIT_TASK, {
                ...newTask,
                taskId: task?.taskId,
                dueTo: formattedDate,
            })
        },
        onSuccess: () => {
            console.log("задача изменена")
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const priority = {
        DEFAULT: "Обычный",
        LOW: "Низкий",
        MEDIUM: "Средний",
        HIGH: "Высокий",
    }
    const status = {
            NEW: "Новые",
            IN_PROGRESS: "В работе",
            COMPLETE: "Выполненные"
    }
    const {data: users} = useUsers()
    const usersMap = users ? Object.fromEntries([["null", "Без жертвы"], ...users.map(user =>
            [String(user.id), `Чел №${user.id}`])]) : undefined


    return (
        <FormProvider {...mainForm}>
            <div className={classes.taskContainer}>
                <div className={classes.row}>
                    <p className={classes.number}>DEV-1</p>
                    <span className={classes.title}>{task.title}</span>
                </div>
                <div className={classes.row}>
                    <Select values={status} name={"status"} />
                    <Select values={priority} name={"priority"} />
                    {usersMap && <Select values={usersMap} name={"assignedToUserId"} />}

                    <TaskDialog type="Edit" task={formattedTask} />

                </div>
            </div>
        </FormProvider>


    )
}

export default Task;