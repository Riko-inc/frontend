import {useInfiniteQuery} from "@tanstack/react-query";
import {ITaskResponse, TPriority, TStatus} from "./types.ts";
import {api, useAuth} from "../../app/provider/AuthProvider.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import Task from "./Task.tsx";
import {useForm} from "react-hook-form";
import {useEffect} from "react";
import {useInView} from "react-intersection-observer";

interface IFilterValues {
    status: TStatus[],
    priority: TPriority[]
}

const DefaultFilterValues: IFilterValues = {
    status: [],
    priority: [],
}

interface IDataResponse {
    pageParam: number[],
    pages: ITaskResponse[][]
}

const TASKS_PER_PAGE: number = 3;

const TaskList = () => {

    const { userId } = useAuth()

    const { register, watch} = useForm<IFilterValues>({
        defaultValues: DefaultFilterValues
    });

    const filters = watch();

    const { ref, inView } = useInView();

    const fetchTasks =
        async ({ pageParam, queryKey }: { pageParam?: number; queryKey: [string, IFilterValues] }): Promise<ITaskResponse[]> => {
        const [, filters] = queryKey;

        // const formattedFilters = {
        //     status: filters.status.join(','),
        //     priority: filters.priority.join(',')
        // }
        const response =
            await api.get<ITaskResponse[]>(`${API_ENDPOINTS.GET_TASKS}/${userId}`, {
            params: {
                page: pageParam,
                size: TASKS_PER_PAGE,
                ...(filters.status?.length ? { status: filters.status.join(',') } : {}),
                ...(filters.priority?.length ? { priority: filters.priority.join(',') } : {}),
            }
        })
            console.log(response.data)
        return response.data
    }

    const {
        data,
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

    // console.log("isFetchingNextPage", isFetchingNextPage)
    // console.log("isLoading", isLoading)

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);


    if (error) return <div>Ошибка: {error.message}</div>;

    return (
        <>
            <p>Фильтры</p>

            <form>

                <fieldset>
                    <legend>Статус</legend>
                    <label>
                        <input type="checkbox" value="NEW" {...register('status')} />
                        Новое
                    </label>
                    <label>
                        <input type="checkbox" value="IN_PROGRESS" {...register('status')} />
                        В работе
                    </label>
                    <label>
                        <input type="checkbox" value="COMPLETE" {...register('status')} />
                        Выполнено
                    </label>
                </fieldset>
                <fieldset>
                    <legend>Приоритет</legend>
                    <label>
                        <input type="checkbox" value="DEFAULT" {...register('priority')} />
                        Обычный
                    </label>
                    <label>
                        <input type="checkbox" value="LOW" {...register('priority')} />
                        Низкий
                    </label>
                    <label>
                        <input type="checkbox" value="MEDIUM" {...register('priority')} />
                        Средний
                    </label>
                    <label>
                        <input type="checkbox" value="HIGH" {...register('priority')} />
                        Высокий
                    </label>
                </fieldset>

                {/*<select*/}
                {/*    {...register('status')}*/}
                {/*    // aria-invalid={!!errors.category}*/}
                {/*>*/}
                {/*    <option value="">Без фильтра</option>*/}
                {/*    <option value="NEW">Новое</option>*/}
                {/*    <option value="IN_PROGRESS">В работе</option>*/}
                {/*    <option value="COMPLETE">Выполнено</option>*/}
                {/*</select>*/}
                {/*{errors.status && <div>status is wrong</div>}*/}
                {/*<select*/}
                {/*    {...register('priority')}*/}
                {/*    // aria-invalid={!!errors.category}*/}
                {/*>*/}
                {/*    <option value="">Без фильтра</option>*/}
                {/*    <option value="DEFAULT">Обычный</option>*/}
                {/*    <option value="LOW">Низкий</option>*/}
                {/*    <option value="MEDIUM">Средний</option>*/}
                {/*    <option value="HIGH">Высокий</option>*/}
                {/*</select>*/}
                {/*{errors.priority && <div>priority is wrong</div>}*/}
            </form>


            <p>Список задач</p>
            <button onClick={() => console.log(filters)}>Фильтры</button>
            <button onClick={() => console.log(data)}>data</button>
            <button onClick={() => console.log({
                "inView": inView,
                "hasNextPage": hasNextPage,
                "isFetchingNextPage": isFetchingNextPage,
            })}>params</button>


            {data?.pages?.flat().map((task) => (
                <div key={task.taskId}>
                    <Task task={task} />
                </div>
            ))}


            <div ref={ref}>
                {isFetchingNextPage ? 'Загрузка...' : hasNextPage ? 'Прокрутите вниз' : 'Все задачи загружены'}
            </div>

            {/*<div ref={loadMoreRef} style={{ height: "1px" }} />*/}
        </>
    )
}

export default TaskList;