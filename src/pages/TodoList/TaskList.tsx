import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {ITaskResponse, TPriority, TStatus} from "./types.ts";
import {api, useAuth} from "../../app/provider/AuthProvider.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import Task from "./Task.tsx";
import {useForm} from "react-hook-form";
import {useEffect, useRef, useState} from "react";

interface IFilterValues {
    status: TStatus | "",
    priority: TPriority | ""
}

const DefaultFilterValues: IFilterValues = {
    status: "",
    priority: "",
}

const TASKS_PER_PAGE: number = 3;

const TaskList = () => {

    const { userId } = useAuth()

    const { register, handleSubmit, formState: {errors}} = useForm<IFilterValues>({
        defaultValues: DefaultFilterValues
    });

    const [filters, setFilters] = useState<IFilterValues>(DefaultFilterValues);


    const fetchTasks =
        async ({ pageParam }: { pageParam: number }): Promise<ITaskResponse[]> => {
        const { data } = await api.get<ITaskResponse[]>(`${API_ENDPOINTS.GET_TASKS}/${userId}`, {
            params: {
                page: pageParam,
                size: TASKS_PER_PAGE,
                status: filters.status,
                priority: filters.priority,
            }
        })
        console.log(data)
        return data
    }

    const {
        data,
        error,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage,
    } = useInfiniteQuery<ITaskResponse[]>({
        queryKey: ["tasks", filters],
        queryFn: fetchTasks,
        enabled: !!userId,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) =>
            lastPage.length === TASKS_PER_PAGE ? allPages.length : undefined
    })

    const loadMoreRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && hasNextPage) {
                fetchNextPage();
            }
        }, { threshold: 0.1 });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => {
            if (loadMoreRef.current) {
                observer.unobserve(loadMoreRef.current);
            }
            observer.disconnect()
        };
    }, [hasNextPage, fetchNextPage]);

    const onSubmit = (data: IFilterValues) => {
        setFilters(data)
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
            <button onClick={() => console.log(filters)}>Фильтры</button>

            {data?.pages.map((page, pageIndex) => (
                <div key={`page-${pageIndex}`}>
                    {page.map((task) => (
                        <Task key={task.taskId} task={task} />
                    ))}
                </div>
            ))}
            {error && <div>Ошибка загрузки: {error.message}</div>}

            <div ref={loadMoreRef} style={{ height: "1px" }} />

            {isFetchingNextPage && <p>Загрузка...</p>}
            {!hasNextPage && <p>Больше задач нет</p>}
        </>
    )
}

export default TaskList;