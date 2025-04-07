import {ITaskResponse} from "./types.ts";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";
import EditTaskForm from "./EditTaskForm.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";

const Task = ({ task }: {task: ITaskResponse}) => {

    const queryClient = useQueryClient();

    const deleteTaskMutation = useMutation({
        mutationFn: () =>
            api.delete(`${API_ENDPOINTS.DELETE_TASK}/${task.taskId}`),
        onSuccess: () => {
            console.log("задача удалена")
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const deleteTask = () => {
        console.log("deleteTaskMutation");
        deleteTaskMutation.mutate()
    }

    return (
        <>
            <div>------------------------------------------</div>
            <div>{task.taskId}</div>
            <div>{task.title}</div>
            <div>{task.description}</div>
            <div>{task.status}</div>
            <div>{task.priority}</div>
            <EditTaskForm task={task} />
            <button onClick={() => deleteTask()}>Удалить задачу</button>
        </>
    )
}

export default Task;