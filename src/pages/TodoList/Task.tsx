import {ICreatedTask} from "./types.ts";
import {useMutation} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";
import EditTaskForm from "./EditTaskForm.tsx";

const Task = ({ task }: {task: ICreatedTask}) => {


    const deleteTaskMutation = useMutation({
        mutationFn: () =>
            api.delete("/task/api/v1/task/" + task.taskId),
        onSuccess: () => {
            console.log("задача удалена")
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