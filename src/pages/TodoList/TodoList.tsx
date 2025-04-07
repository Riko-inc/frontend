import {useNavigate} from "react-router-dom";
import CreateTaskForm from "./CreateTaskForm.tsx";
import {useQuery} from "@tanstack/react-query";
import {api, useAuth} from "../../app/provider/AuthProvider.tsx";
import {ITaskResponse} from "./types.ts";
import Task from "./Task.tsx";
import {ROUTES} from "../../app/routes/Routes.tsx";

interface IUser {
    id: number
    email: string
    role: string
    registrationDateTime: string
}

const TodoList = () => {

    const { userId } = useAuth()
    const navigate = useNavigate();


    const {data: tasks, isLoading, isError} = useQuery<ITaskResponse[]>({
        queryKey: ['tasks'],
        queryFn: () =>
            api.get<ITaskResponse[]>(`/task/api/v1/tasks/${userId}`)
                .then((res) => res.data),
        enabled: !!userId
    })
    

    return (
        <>
            <div>TodoList</div>
            <button onClick={() => navigate(ROUTES.MAIN)}>Вернуться на главную страницу</button>

            <CreateTaskForm />

            <p>Список задач</p>
            <button onClick={() => console.log(tasks)}>Задачи</button>
            {tasks && tasks.map((task) =>
                <Task key={task.taskId} task={task} />
            )}
        </>
    )
}

export default TodoList;