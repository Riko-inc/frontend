import {useNavigate} from "react-router-dom";
import CreateTaskForm from "./CreateTaskForm.tsx";
import {useQuery} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";
import {ICreatedTask} from "./types.ts";
import Task from "./Task.tsx";
import {ROUTES} from "../../app/routes/Routes.tsx";


const TodoList = () => {

    const navigate = useNavigate();


    const {data: tasks, isLoading, isError} = useQuery<ICreatedTask[]>({
        queryKey: ['tasks'],
        queryFn: () =>
            api.get<ICreatedTask[]>("/task/api/v1/task/tasks")
                .then((res) => res.data),

    })

    return (
        <>
            <div>TodoList</div>
            <button onClick={() => navigate(ROUTES.MAIN)}>Вернуться на главную страницу</button>

            <CreateTaskForm />

            <p>Список задач</p>
            {/*tasks.length > 0*/}
            {tasks && tasks.map((task) =>
                <Task key={task.taskId} task={task} />
            )}
        </>
    )
}

export default TodoList;