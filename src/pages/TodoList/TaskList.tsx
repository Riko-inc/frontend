import {useQuery} from "@tanstack/react-query";
import {ITaskResponse, TPriority, TStatus} from "./types.ts";
import {api, useAuth} from "../../app/provider/AuthProvider.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import Task from "./Task.tsx";
import {useForm} from "react-hook-form";
import {useState} from "react";

interface IFilterValues {
    status: TStatus | "",
    priority: TPriority | ""
}

const FilterDefaultValues: IFilterValues = {
    status: "",
    priority: "",
}


const TaskList = () => {

    const { userId } = useAuth()

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<IFilterValues>({
        defaultValues: FilterDefaultValues
    });

    const [filters, setFilters] = useState<IFilterValues>(FilterDefaultValues);

    const getTasks = async (filters: IFilterValues) => {
        const { data } = await api.get<ITaskResponse[]>(`${API_ENDPOINTS.GET_TASKS}/${userId}`)
        return data
    }


    const {data: tasks} = useQuery<ITaskResponse[]>({
        queryKey: ["tasks", filters],
        queryFn: () => getTasks(filters),
        enabled: !!userId
    })

    const onSubmit = (filters: IFilterValues) => {
        setFilters(filters)
    }


    return (
        <>
            <p>Фильтры</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <select
                    {...register('status')}
                    onChange={() => handleSubmit(onSubmit)()}
                    // aria-invalid={!!errors.category}
                >
                    <option value="">Без фильтра</option>
                    <option value="NEW">Новое</option>
                    <option value="IN_PROGRESS">В работе</option>
                    <option value="COMPLETE">Выполнено</option>
                </select>
                {errors.status && <div>status is wrong</div>}
                <select
                    {...register('priority')}
                    onChange={() => handleSubmit(onSubmit)()}
                    // aria-invalid={!!errors.category}
                >
                    <option value="">Без фильтра</option>
                    <option value="DEFAULT">Обычный</option>
                    <option value="LOW">Низкий</option>
                    <option value="MEDIUM">Средний</option>
                    <option value="HIGH">Высокий</option>
                </select>
                {errors.priority && <div>priority is wrong</div>}
            </form>


            <p>Список задач</p>
            <button onClick={() => console.log(tasks)}>Задачи</button>
            {tasks && tasks.map((task) =>
                <Task key={task.taskId} task={task} />
            )}
        </>
    )
}

export default TaskList;