import {ITaskResponse} from "../../shared/types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app/contexts/AuthContext.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import {useState} from "react";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import {flexRow} from "../../shared/styles/mixins.ts";
import Select from "./Select.tsx";
import {useUsers} from "./lib.ts";



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
    const [error, setError] = useState(false)

    const deleteTaskMutation = useMutation({
        mutationFn: () =>
            api.delete(`${API_ENDPOINTS.DELETE_TASK}/${task.taskId}`),
        onSuccess: () => {
            console.log("задача удалена")
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error) => {
            console.error(error);
            setError(true);
            const timer = setTimeout(() => {
                setError(false);
                clearTimeout(timer);
            }, 20000);
        }
    });

    const deleteTask = () => {
        console.log("deleteTaskMutation");
        deleteTaskMutation.mutate()
    }

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


    return (
        <div className={classes.taskContainer}>
            <div className={classes.row}>
                <p className={classes.number}>DEV-1</p>
                <span className={classes.title}>{task.title}</span>
            </div>
            <div className={classes.row}>
                <Select values={status} name={"status"} currentValue="NEW"/>
                <Select values={priority} name={"priority"} currentValue="DEFAULT"/>
                <button onClick={() => deleteTask()}>Удалить задачу</button>
            </div>







            {/*<div>------------------------------------------</div>*/}
            {/*<div>ID {task.taskId}</div>*/}
            {/*<div>{task.title}</div>*/}
            {/*<div>{task.description}</div>*/}
            {/*<div>Статус {task.status}</div>*/}
            {/*<div>Приоритет {task.priority}</div>*/}
            {/*<div>Кому назначено {task.assignedToUserId}</div>*/}
            {/*<div>Автор назначил {task.createdByUserId}</div>*/}
            {/*<div>Дата создания {task.createdDate}</div>*/}
            {/*<EditTaskForm task={task} />*/}

            {/*{error && <Image />}*/}
        </div>


    )
}

export default Task;