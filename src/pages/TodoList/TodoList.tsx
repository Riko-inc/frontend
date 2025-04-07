import {useNavigate} from "react-router-dom";
import CreateTaskForm from "./CreateTaskForm.tsx";
import {useQuery} from "@tanstack/react-query";
import {api, useAuth} from "../../app/provider/AuthProvider.tsx";
import {ITaskResponse} from "./types.ts";
import Task from "./Task.tsx";
import {ROUTES} from "../../app/routes/Routes.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";

const TodoList = () => {

    const { userId } = useAuth()
    const navigate = useNavigate();


    const {data: tasks} = useQuery<ITaskResponse[]>({
        queryKey: ['tasks'],
        queryFn: () =>
            api.get<ITaskResponse[]>(`${API_ENDPOINTS.GET_TASKS}/${userId}`)
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