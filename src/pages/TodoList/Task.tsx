import {ITaskResponse} from "./types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";
import EditTaskForm from "./EditTaskForm.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import {useState} from "react";
import Image from "./Image.tsx";

const Task = ({ task }: {task: ITaskResponse}) => {

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

    return (
        <div>
            <div>------------------------------------------</div>
            <div>ID {task.taskId}</div>
            <div>{task.title}</div>
            <div>{task.description}</div>
            <div>Статус {task.status}</div>
            <div>Приоритет {task.priority}</div>
            <div>Кому назначено {task.assignedToUserId}</div>
            <div>Автор назначил {task.createdByUserId}</div>
            <div>Дата создания {task.createdDate}</div>
            <EditTaskForm task={task} />
            <button onClick={() => deleteTask()}>Удалить задачу</button>
            {error && <Image />}
        </div>
    )
}

export default Task;