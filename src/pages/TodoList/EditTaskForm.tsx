import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ITaskResponse} from "./types.ts";
import {api} from "../../app/provider/AuthProvider.tsx";
import {Controller, useForm} from "react-hook-form";
import {useState} from "react";
import DatePicker from "react-datepicker";
import {format, parse} from "date-fns";
import {API_ENDPOINTS} from "../../shared/config.ts";

const EditTaskForm = ({ task }: {task: ITaskResponse}) => {

    const [isEditing, setIsEditing] = useState(false);
    const queryClient = useQueryClient();

    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        reset,
    } = useForm<ITaskResponse>({
        defaultValues: task,
    });

    const editTaskMutation = useMutation({
        mutationFn: (newTask: ITaskResponse) => {
            const formattedDate = newTask.dueTo ? format(newTask.dueTo, 'dd-MM-yyyy HH:mm') : null;
            return api.put(API_ENDPOINTS.EDIT_TASK, {
                ...newTask,
                taskId: task.taskId,
                dueTo: formattedDate,
            })
        },
        onSuccess: () => {
            console.log("задача изменена")
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const onSubmit = (data: ITaskResponse) => {
        console.log("editTaskMutation");
        editTaskMutation.mutate(data)
        console.log(data)
    }

    const handleCancel = () => {
        reset()
        setIsEditing(false);
    }

    return (
        <>
            {!isEditing &&  <button onClick={() => setIsEditing(true)}>Изменить задачу</button>}
            {isEditing &&
                <>
                    <button onClick={handleCancel}>Отменить</button>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input
                            {...register("title", {
                                required: "error",
                            })}

                            placeholder="Заголовок"
                        />
                        {errors.title && <div>title is wrong</div>}
                        <input
                            {...register("description")}
                            //type="password"
                            placeholder="Описание"
                        />
                        {errors.description && <div>description is wrong</div>}
                        <select
                            {...register('status')}
                            // aria-invalid={!!errors.category}
                        >
                            <option value="NEW">Новое</option>
                            <option value="IN_PROGRESS">В работе</option>
                            <option value="COMPLETE">Выполнено</option>
                        </select>
                        {errors.status && <div>status is wrong</div>}
                        <select
                            {...register('priority')}
                            // aria-invalid={!!errors.category}
                        >
                            <option value="DEFAULT">Обычный</option>
                            <option value="LOW">Низкий</option>
                            <option value="MEDIUM">Средний</option>
                            <option value="HIGH">Высокий</option>
                        </select>
                        {errors.priority && <div>priority is wrong</div>}
                        <input
                            {...register("assignedToUserId")}
                            placeholder="ID кому назначено"
                        />
                        {errors.assignedToUserId && <div>User is wrong</div>}
                        <Controller
                            control={control}
                            name="dueTo"
                            render={({ field }) => {
                                let selectedDate = null;
                                if (field.value) {
                                    selectedDate =
                                        typeof field.value === 'string'
                                            ? parse(field.value, 'dd-MM-yyyy HH:mm', new Date())
                                            : field.value;
                                }
                                return (
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={date => field.onChange(date)}
                                        showTimeSelect
                                        dateFormat="dd-MM-yyyy HH:mm"
                                        timeFormat="HH:mm"
                                        timeIntervals={15}
                                        className="form-control"
                                        placeholderText="Дедлайн"
                                    />
                                );
                            }}
                        />
                        {errors.dueTo && <div>Time is wrong</div>}
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