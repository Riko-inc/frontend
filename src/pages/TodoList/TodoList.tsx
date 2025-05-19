import TaskList from "./TaskList.tsx";
import {Navbar} from "../../widgets/Navbar";
import {useAppDispatch, useAppSelector} from "../../shared/store/hooks/redux.ts";
import {useUsers} from "./lib.ts";
import {setSettings} from "../../shared/store/settingsSlice.ts";
import {TStatus} from "../../shared/types.ts";
import {useEffect} from "react";


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
    }, [dispatch, status, priority, usersMap]);

    const filters = useAppSelector((state) => state.filters);

    const noStatusChosen = filters.status.length === 0

    return (
        <>
            <Navbar />

            {Object.entries(status).map(([statusKey, statusLabel]) => (
                <div key={statusKey}>
                    <p>{statusLabel}</p>
                    {(noStatusChosen || filters.status.includes(statusKey as TStatus)) &&
                        <TaskList filters={{
                            ...filters,
                            status: [statusKey as TStatus]
                        }} />
                    }
                </div>
            ))}
        </>
    )
}

export default TodoList;