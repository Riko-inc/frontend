import {useInfiniteQuery} from "@tanstack/react-query";
import {IFilterValues, ITaskResponse} from "../../shared/types.ts";
import {api, useAuth} from "../../app";
import {API_ENDPOINTS} from "../../shared/endpoints.ts";
import Task from "./Task.tsx";
import {useEffect} from "react";
import {useInView} from "react-intersection-observer";


interface IDataResponse {
    pageParam: number[],
    pages: ITaskResponse[][]
}

const TASKS_PER_PAGE: number = 50;

const TaskList = ({ filters }: {filters: IFilterValues}) => {

    const { userId } = useAuth()
    console.log("tasklist filters", filters)
    const { ref, inView } = useInView();

    const fetchTasks =
        async ({ pageParam, queryKey }: { pageParam?: number; queryKey: [string, IFilterValues] }): Promise<ITaskResponse[]> => {
        const [, filters] = queryKey;

        const response =
            await api.get<ITaskResponse[]>(`${API_ENDPOINTS.GET_TASKS}/${userId}`, {
            params: {
                page: pageParam,
                size: TASKS_PER_PAGE,
                ...(filters.status?.length ? { status: filters.status.join(',') } : {}),
                ...(filters.priority?.length ? { priority: filters.priority.join(',') } : {}),
                ...(filters.assignedToUserId?.length ? { assignedToUserId: filters.assignedToUserId.join(',') } : {}),
                ...(filters.createdByUserId?.length ? { createdByUserId: filters.createdByUserId.join(',') } : {}),
            }
        })
            console.log(response.data)
        return response.data
    }

    const {
        data: tasks,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery<ITaskResponse[], Error, IDataResponse, [string, IFilterValues], number>({
        queryKey: ["tasks", filters],
        queryFn: fetchTasks,
        enabled: !!userId,
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length < TASKS_PER_PAGE ? undefined : allPages.length;
        }
    })

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);


    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <>
            {tasks?.pages?.flat().map((task) => (
                <div key={task.taskId}>
                    <Task task={task} />
                </div>
            ))}

            <div ref={ref}>
                {isFetchingNextPage ? 'Загрузка...' : hasNextPage ? 'Прокрутите вниз' : 'Все задачи загружены'}
            </div>
        </>
    )
}

export default TaskList;