import {ITaskResponse} from "../../shared/types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app";
import {API_ENDPOINTS} from "../../shared/config.ts";
import {useEffect, useState} from "react";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import {flexRow} from "../../shared/styles/mixins.ts";
import Select from "../../shared/ui/Select.tsx";
import {useUsers} from "./lib.ts";
import {FormProvider, useForm, useWatch} from "react-hook-form";
import TaskDialog from "./TaskDialog.tsx";
import {format} from "date-fns";
import DeleteButton from "./DeleteButton.tsx";


const useStyles = createUseStyles((theme: ITheme) => ({
    taskContainer: {
        ...flexRow,
        border: `1px solid ${theme.colors.neutral}`,
        cursor: "pointer",

        backgroundColor: theme.colors.background,
        color: theme.colors.text,
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
    dialog: {
        display: 'none'
    }

}));


const Task = ({ task }: {task: ITaskResponse}) => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

    const formattedTask = {
        ...task,
        assignedToUserId: task.assignedToUserId ? String(task.assignedToUserId) : "null",
    }
    const mainForm = useForm<ITaskResponse>({
        defaultValues: formattedTask,
    })

    const formValues = useWatch<ITaskResponse>({ control: mainForm.control });


    useEffect(() => {
        if (task) {
            mainForm.reset(formattedTask);
        }
    }, [task])

    const [isUserAction, setIsUserAction] = useState(false);

    useEffect(() => {
        if (isUserAction) {
            editTaskMutation.mutate(formValues as ITaskResponse);
            setIsUserAction(false);
        }
    }, [formValues, isUserAction]);

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
            setOpen(false)
            console.log("задача изменена")
            queryClient.invalidateQueries({ queryKey: ['tasks'] })

        },
        onError: (error) => {
            console.error(error);
        }
    });


    return (
        <FormProvider {...mainForm}>
            <div className={classes.taskContainer} onClick={() => setOpen(true)}>
                <div className={classes.row}>
                    <p className={classes.number}>DEV-1</p>
                    <span className={classes.title}>{task.title}</span>
                </div>
                <div className={classes.row}>
                    <Select values={status} name={"status"}
                            setIsUserActionTrue={() => setIsUserAction(true)} />
                    <Select values={priority} name={"priority"}
                            setIsUserActionTrue={() => setIsUserAction(true)} />
                    {usersMap && <Select values={usersMap} name={"assignedToUserId"}
                                         setIsUserActionTrue={() => setIsUserAction(true)} />}

                    <div className={classes.dialog}>
                        <TaskDialog task={formattedTask} open={open}
                                    onOpenChange={() => setOpen(false)}
                                    taskMutationFunction={editTaskMutation.mutate}
                                    title="Изменить задачу"
                                    triggerText="Изменить задачу"
                                    description="Отредактируйте необходимые поля">
                            <DeleteButton taskId={task.taskId} />
                        </TaskDialog>
                    </div>
                </div>
            </div>
        </FormProvider>
    )
}

export default Task;