import {Navbar} from "../../widgets/Navbar";
import {useAppDispatch, useAppSelector} from "../../shared/store/hooks/redux.ts";
import {useUsers} from "./lib.ts";
import {setSettings} from "../../shared/store/settingsSlice.ts";
import {useEffect} from "react";
import TaskModules from "./TaskModules.tsx";
import {DndContext} from "@dnd-kit/core";

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


    return (
        <>
            <Navbar />
            <DndContext>
                {Object.entries(status).map(([statusKey, statusLabel]) => (
                    <div key={statusKey}>
                        <TaskModules statusKey={statusKey} statusLabel={statusLabel} filters={filters} />
                    </div>
                ))}
            </DndContext>

        </>
    )
}

export default TodoList;