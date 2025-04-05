import {useMutation} from "@tanstack/react-query";
import {ICreatedTask} from "./types.ts";
import {api} from "../../app/provider/AuthProvider.tsx";
import {useForm} from "react-hook-form";
import {useState} from "react";

const EditTaskForm = ({ task }: {task: ICreatedTask}) => {

    const [isEditing, setIsEditing] = useState(false);

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm<ICreatedTask>();

    const editTaskMutation = useMutation({
        mutationFn: (newTask: ICreatedTask) =>
            api.put("/task/api/v1/task/" + task.taskId, {
                ...newTask,
                taskId: task.taskId,
            } as ICreatedTask),
        onSuccess: () => {
            console.log("задача изменена")
            setIsEditing(false);
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const onSubmit = (data: ICreatedTask) => {
        console.log("editTaskMutation");
        editTaskMutation.mutate(data)
        console.log(data)
    }

    return (
        <>
            {!isEditing &&  <button onClick={() => setIsEditing(true)}>Изменить задачу</button>}
            {isEditing &&
                <>
                    <button onClick={() => setIsEditing(false)}>Отменить</button>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            {...register("title", {
                                required: "error",
                            })}
                            defaultValue={task.title}
                            placeholder="Заголовок"
                        />
                        {errors.title && <div>title is wrong</div>}
                        <input
                            {...register("description", {
                                required: "error",
                            })}
                            defaultValue={task.description}
                            //type="password"
                            placeholder="Описание"
                        />
                        {errors.description && <div>description is wrong</div>}
                        <select
                            {...register('status', {
                                required: 'error'
                            })}
                            defaultValue={task.status}
                            // aria-invalid={!!errors.category}
                        >
                            <option value="NEW">Новое</option>
                            <option value="IN_PROGRESS">В работе</option>
                            <option value="COMPLETE">Выполнено</option>
                        </select>
                        {errors.status && <div>status is wrong</div>}
                        <select
                            {...register('priority', {
                                required: 'error'
                            })}
                            defaultValue={task.priority}
                            // aria-invalid={!!errors.category}
                        >
                            <option value="DEFAULT">Обычный</option>
                            <option value="LOW">Низкий</option>
                            <option value="MEDIUM">Средний</option>
                            <option value="HIGH">Высокий</option>
                        </select>
                        {errors.priority && <div>priority is wrong</div>}
                        <div>
                            <button
                                disabled={editTaskMutation.isPending}
                                type="submit"
                            >{editTaskMutation.isPending ? 'Editing...' : 'Edit'}</button>
                        </div>
                    </form>
                </>
            }
        </>
    )
}

export default EditTaskForm;