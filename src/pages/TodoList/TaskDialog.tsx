import {FormProvider, useForm} from "react-hook-form";
import {ITaskRequest, ITaskResponse} from "../../shared/types.ts";
import Select from "./Select.tsx";
import {useUsers} from "./lib.ts";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import { Dialog } from "radix-ui";
import {Cross2Icon} from "@radix-ui/react-icons";
import {FC, useEffect, useState} from "react";
import Input from "../../shared/ui/Input.tsx";
import {flexCenter, flexRow} from "../../shared/styles/mixins.ts";
import Button from "../../shared/ui/Button.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {format} from "date-fns";
import {api} from "../../app/contexts/AuthContext.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";


const useStyles = createUseStyles((theme: ITheme) => ({
    Overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        position: 'fixed',
        inset: 0,
    },
    Content: {
        border: `1px solid ${theme.colors.neutral}`,
        backgroundColor: theme.colors.background,
        borderRadius: "8px",
        ...flexCenter("column"),
        position: 'fixed',
        top: '40%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '700px',
        padding: theme.spacing.md,

    },
    Title: {
        display: 'flex',
        justifyContent: 'start',
        width: '100%',
        margin: `0 ${theme.spacing.xs}`,

        fontSize: theme.typography.fontSize.large,
    },
    Description: {
        margin: theme.spacing.xs,
        color: theme.colors.neutral,
        display: 'flex',
        justifyContent: 'end',
        width: '100%',
    },
    IconButton: {
        all: 'unset',
        fontFamily: 'inherit',
        borderRadius: '100%',
        height: 30,
        width: 30,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.colors.text,
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: theme.colors.background,
        '&:hover': {
            backgroundColor: theme.colors.neutral,
        },
    },
    Form: {
        width: '100%',
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    ButtonsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        width: '100%',
    },
    Row: {
        ...flexRow,
    },
    DeleteButton: {
        backgroundColor: 'red',
        "&:hover": {
            backgroundColor: 'darkred',
        },
    },
    Input: {
        margin: 0,
        width: '100%',
    },
    Textarea: {
        resize: 'none',
        backgroundColor: theme.colors.background,
        color: theme.colors.text,
        transition: "all 0.2s ease",
        "&::placeholder": {
            color: theme.colors.neutral,
            opacity: 1,
        },

        border: `1px solid ${theme.colors.neutral}`,
        borderRadius: "7px",
        "&:hover": {
            boxShadow: `0 0 5px ${theme.colors.neutral}`,
        },
        "&:focus": {
            outline: "none",
        },
        minHeight: "150px",
        width: '100%',
        padding: `${theme.spacing.sm} ${theme.spacing.md}`,

        fontSize: theme.typography.fontSize.medium,
        fontFamily: theme.typography.fontFamily,
        fontWeight: theme.typography.fontWeight,
        boxSizing: 'border-box'
    },

}));

interface TaskDialogProps {
    type: "Create" | "Edit"
    task?: ITaskResponse
    taskMutationFunction: () => void
}

const TaskDialog: FC<TaskDialogProps> = ({ type, task, taskMutationFunction }) => {
    const classes = useStyles();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);

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

    const modalForm = useForm<ITaskResponse>({
        defaultValues: task
    });

    useEffect(() => {
        if (open && task) {
            modalForm.reset(task);
        }
        if (open && !task) {
            modalForm.reset({
                title: "",
                description: "",
                priority: "DEFAULT",
                status: "NEW",
                assignedToUserId: "null",
                // dueTo: "",
            });
        }
    }, [open, task]);

    useEffect(() => {
        setOpen(false)
    }, [task]);

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
            // setOpen(false);
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const createTaskMutation = useMutation({
        mutationFn: (newTask: ITaskRequest) => {
            const formattedDate = newTask.dueTo ? format(newTask.dueTo, 'dd-MM-yyyy HH:mm') : null;
            return api.post(API_ENDPOINTS.CREATE_TASK, {
                ...newTask,
                dueTo: formattedDate,
            })
        },
        onSuccess: (data) => {
            console.log("чел, задача создалась", data)
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            setOpen(false);
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const deleteTaskMutation = useMutation({
        mutationFn: () =>
            api.delete(`${API_ENDPOINTS.DELETE_TASK}/${task?.taskId}`),
        onSuccess: () => {
            console.log("задача удалена")
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const deleteTask = () => {
        deleteTaskMutation.mutate()
    }

    const onSubmit = (data: ITaskResponse) => {
        console.log("TaskDialog");
        if (type === "Create") {
            createTaskMutation.mutate(data)
        }
        if (type === "Edit") {
            editTaskMutation.mutate(data)

        }
        console.log(data)
    }

    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
                <Button fontSize="14px">{type === "Create" ? "Создать задачу" : "Изменить задачу"}</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={classes.Overlay} />
                <Dialog.Content className={classes.Content}>
                    <Dialog.Title className={classes.Title}>
                        {type === "Create" ? "Создать задачу" : "Изменить задачу"}
                    </Dialog.Title>
                    <Dialog.Description className={classes.Description}>
                        {type === "Create" ? "Заполните поля для новой задачи" : "Отредактируйте необходимые поля"}
                    </Dialog.Description>
                    <FormProvider {...modalForm}>
                        <form className={classes.Form} onSubmit={modalForm.handleSubmit(onSubmit)}>
                            <Input
                                className={classes.Input}
                                minWidth="auto"
                                placeholder="Заголовок"
                                name="title"
                                fontSize="16px"
                                required />
                            <textarea
                                className={classes.Textarea}
                                placeholder="Описание"
                                {...modalForm.register("description")} />

                            <div className={classes.ButtonsContainer}>
                                <div className={classes.Row}>
                                    {type === "Edit" &&
                                        <Button fontSize="16px"
                                                onClick={() => deleteTask()}>Удалить</Button>}
                                </div>
                                <div className={classes.Row}>
                                    <Select values={status} name={"status"} />
                                    <Select values={priority} name={"priority"} />
                                    {usersMap && <Select values={usersMap} name={"assignedToUserId"} />}

                                    <Button type="submit">Сохранить</Button>
                                </div>
                            </div>
                        </form>
                    </FormProvider>
                    <Dialog.Close asChild>
                        <button className={classes.IconButton} aria-label="Close">
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>

    );
};

export default TaskDialog;