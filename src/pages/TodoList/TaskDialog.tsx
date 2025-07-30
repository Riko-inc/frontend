import {FormProvider, useForm} from "react-hook-form";
import {ITaskResponse} from "../../shared/types.ts";
import Select from "../../shared/ui/Select.tsx";
import {useUsers} from "./lib/lib.ts";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import { Dialog } from "radix-ui";
import {FC, ReactNode, useEffect} from "react";
import Input from "../../shared/ui/Input.tsx";
import {flexCenter, flexRow} from "../../shared/styles/mixins.ts";
import Button from "../../shared/ui/Button.tsx";


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
    children?: ReactNode
    task?: ITaskResponse,
    open: boolean
    onOpenChange: () => void
    taskMutationFunction: (task: ITaskResponse) => void;
    triggerText?: string
    title?: string
    description?: string
}

const TaskDialog: FC<TaskDialogProps> = ({ children, task, open, onOpenChange, taskMutationFunction,
                                         triggerText, title, description}) => {
    const classes = useStyles();

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
        if (!open && task) {
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


    const onSubmit = (data: ITaskResponse) => {
        console.log("TaskMutation");
        taskMutationFunction(data)
        console.log(data)
    }

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Trigger asChild>
                <Button fontSize="14px">{triggerText}</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
                <Dialog.Overlay className={classes.Overlay} />
                <Dialog.Content className={classes.Content}>
                    <Dialog.Title className={classes.Title}>
                        {title}
                    </Dialog.Title>
                    <Dialog.Description className={classes.Description}>
                        {description}
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
                                    {children}
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
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>

    );
};

export default TaskDialog;