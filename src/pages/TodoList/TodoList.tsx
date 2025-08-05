import {Navbar} from "../../widgets/Navbar";
import {useAppDispatch, useAppSelector} from "../../shared/store/hooks/redux.ts";
import {useUsers} from "./lib/lib.ts";
import {setSettings} from "../../shared/store/settingsSlice.ts";
import { useEffect, useState} from "react";
import TaskModules from "./TaskModules.tsx";
import {
    DndContext,
    DragEndEvent, DragOverEvent,
    DragOverlay,
    DragStartEvent,
    UniqueIdentifier,
    useDndMonitor
} from "@dnd-kit/core";
import {ITaskResponse, TStatus} from "../../shared/types.ts";
import Task from "./Task.tsx";
import {api} from "../../app";
import {API_ENDPOINTS} from "../../shared/endpoints.ts";
import {useQueryClient} from "@tanstack/react-query";

const TodoList = () => {

    const priority = {
        DEFAULT: "Обычный",
        LOW: "Низкий",
        MEDIUM: "Средний",
        HIGH: "Высокий",
    }
    const status = {
        NEW: "Новые",
        IN_PROGRESS: "В работе",
        COMPLETE: "Выполненные"
    }
    const {data: users} = useUsers()
    const usersMap: Record<string, string> = users ? Object.fromEntries([["null", "Без жертвы"], ...users.map(user =>
        [String(user.id), `Чел №${user.id}`])]) : undefined

    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setSettings({
            status,
            priority,
            users: usersMap ?? {},
        }));
    }, []);

    const filters = useAppSelector(state => state.filters);


    const getTaskById = async (taskId: UniqueIdentifier) => {
        const response = await api.get(`${API_ENDPOINTS.GET_TASK_BY_ID}${taskId}`)
        console.log("get task response", response)
        return response.data;
    }

    const [activeTask, setActiveTask] = useState<ITaskResponse | null>(null);

    interface INewTaskPosition {
        task: ITaskResponse,
        status: TStatus,
        position: number
    }
    const queryClient = useQueryClient();

    useDndMonitor({
        async onDragStart(event: DragStartEvent) {
            const { active } = event;
            const task: ITaskResponse = await getTaskById(active.id);
            setActiveTask(task ?? null);
        },
        onDragOver(event: DragOverEvent) {
            // console.log("dragOver", event);
        },
        async onDragEnd(event: DragEndEvent) {
            const { active, over } = event;

            console.log("drag end")

            if (!over) return;
            console.log("1")
            if (!activeTask) return;
            console.log("2")

            const overTask: ITaskResponse = await getTaskById(over.id)

            // const activeRect = active.rect.current.translated;
            // const overRect = over.rect;

            // if (!activeRect || !overRect) return;

            const pointerY = event.activatorEvent instanceof MouseEvent
                ? event.activatorEvent.clientY
                : 0;

            const overRect = over.rect;
            const overMiddleY = overRect.top + overRect.height / 2;
            const isBelow = pointerY > overMiddleY;
            console.log("3")

            const resArray: INewTaskPosition[] = []

            // const isBelow = activeRect.top > overRect.top + overRect.height / 2;

            const overPrevTask: ITaskResponse = over.data.current?.prevTask
            const overNextTask: ITaskResponse = over.data.current?.nextTask
            const overPrevTaskArray: ITaskResponse[] = over.data.current?.prevTaskArray
            const overNextTaskArray: ITaskResponse[] = over.data.current?.nextTaskArray

            let newPosition = -1
            if (isBelow) {
                if (!overNextTask) {
                    newPosition = overTask.position + 1
                }
                else {
                    newPosition = (overTask.position + overNextTask.position) / 2;
                }
            }
            if (!isBelow) {
                if (!overPrevTask) {
                    newPosition = overTask.position / 2
                }
                else {
                    newPosition = (overTask.position + overPrevTask.position) / 2;
                }
            }
            resArray.push({
                task: activeTask,
                status: overTask.status,
                position: newPosition,
            });

            if ((isBelow && overNextTask && overTask.position === overNextTask.position)
                || (!isBelow && overPrevTask && overPrevTask.position === overTask.position)) {

                for (let i = overPrevTaskArray.length - 1; i >= 0; i--) {
                    const currentTask = overPrevTaskArray[i];
                    resArray.unshift({
                        task: currentTask,
                        status: currentTask.status,
                        position: currentTask.position,
                    })
                }
                for (let i = overNextTaskArray.length - 1; i >= 0; i--) {
                    const currentTask = overNextTaskArray[i];
                    resArray.push({
                        task: currentTask,
                        status: currentTask.status,
                        position: currentTask.position,
                    })
                }

                if (resArray[0].position === overTask.position) {
                    resArray[0] = {
                        ...resArray[0],
                        position: resArray[0].position / 2,
                    }
                }
                if (resArray[resArray.length - 1].position === overTask.position) {
                    resArray[resArray.length - 1] = {
                        ...resArray[resArray.length - 1],
                        position: resArray[resArray.length - 1].position + 1,
                    }
                }

                const prevCount = overPrevTaskArray.length - 1
                const nextCount = overNextTaskArray.length - 1

                for (let i = 0; i < prevCount; i++) {
                    resArray[i + 1] = {
                        ...resArray[i + 1],
                        position: (resArray[i].position + resArray[i + 2].position) / 2,
                    }
                }
                for (let i = 0; i < nextCount; i++) {
                    let ind = resArray.length - 1 - i;
                    resArray[ind - 1] = {
                        ...resArray[ind - 1],
                        position: (resArray[ind].position + resArray[ind - 2].position) / 2,
                    }
                }
            }

            const editTasks = async () => {
                try {
                    const requests = resArray.map(newTask => {
                        api.put(`${API_ENDPOINTS.EDIT_TASK}`, {
                            ...newTask.task,
                            status: newTask.status,
                            position: newTask.position,
                        })
                        console.log(newTask)
                    });
                    await Promise.all(requests);

                    console.log("invalid cache")
                } catch (err) {
                    console.error(err);
                }
            }

            await editTasks()
            await queryClient.invalidateQueries({queryKey: ['tasks'], exact: false})

            console.log("resArray", resArray);
        }
    })


    return (
        <>
            <Navbar />
                {Object.entries(status).map(([statusKey, statusLabel]) => (
                    <div key={statusKey}>
                        <TaskModules statusKey={statusKey} statusLabel={statusLabel} filters={filters} />
                    </div>
                ))}



                {/*<DragOverlay>*/}
                {/*    {activeTask && (*/}
                {/*        <>*/}
                {/*            /!*<SortableItem id={activeTask.taskId} isDragging>*!/*/}
                {/*            /!*    <Task task={activeTask} />*!/*/}
                {/*            /!*</SortableItem>*!/*/}
                {/*            <Task task={activeTask} />*/}
                {/*        </>*/}
                {/*    )}*/}
                {/*</DragOverlay>*/}

        </>
    )
}



export default TodoList;