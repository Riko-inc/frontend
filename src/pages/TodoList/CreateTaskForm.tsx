import {Controller, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";
import {ITaskRequest} from "./types.ts";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import {API_ENDPOINTS} from "../../shared/config.ts";
import Image from "./Image.tsx";
import {useUsers} from "./lib.ts";
import {useState} from "react";


const TaskDefaultValues: ITaskRequest = {
    title: "",
    description: "",
    status: "NEW",
    priority: "DEFAULT",
    assignedToUserId: "",
    dueTo: null,
}



const CreateTaskForm = () => {

    const queryClient = useQueryClient();

    const [error, setError] = useState(false)
    const {data: users} = useUsers()

    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<ITaskRequest>({
        defaultValues: TaskDefaultValues,
    });

    const createTaskMutation = useMutation({
        mutationFn: (newTask: ITaskRequest) => {
            const formattedDate = newTask.dueTo ? format(newTask.dueTo, 'dd-MM-yyyy HH:mm') : null;
            return api.post(API_ENDPOINTS.CREATE_TASK, {
                ...newTask,
                dueTo: formattedDate,
            })
        },
        onSuccess: (data) => {
            console.log("чел, задача создалась", data)
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            reset()

        },
        onError: (error) => {
            console.error(error);
            setError(true);
            const timer = setTimeout(() => {
                setError(false);
                clearTimeout(timer);
            }, 20000);
        }
    });

    const onSubmit = (data: ITaskRequest) => {
        console.log("createTaskMutation");
        createTaskMutation.mutate(data)
        console.log(data)
    }


    return (
        <>
            <p>Новая задача</p>

            <form onSubmit={handleSubmit(onSubmit)}>
                <input
                    {...register("title", {
                        required: "error",
                    })}
                    placeholder="Заголовок"
                />
                {errors.title && (
                    <>
                        <div>title is wrong</div>
                        <Image />
                    </>
                )}
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
                <select
                    {...register("assignedToUserId")}
                >
                    <option value="" hidden>
                        Выберите пользователя
                    </option>
                    <option value="">Без пользователя</option>
                    {users ? users.map((user) => (
                        <option value={user.id} key={user.id}>
                            Пользователь с id {user.id}
                        </option>
                    )) : null}
                </select>
                {errors.assignedToUserId && <div>User is wrong</div>}
                <Controller
                    control={control}
                    name="dueTo"
                    render={({ field }) => (
                        <DatePicker
                            selected={field.value}
                            onChange={date => field.onChange(date)}
                            showTimeSelect
                            dateFormat="dd-MM-yyyy HH:mm"
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            className="form-control"
                            placeholderText="Дедлайн"
                        />
                    )}
                />
                {errors.dueTo && <div>Time is wrong</div>}
                <div>
                    <button
                        disabled={createTaskMutation.isPending}
                        type="submit"
                    >{createTaskMutation.isPending ? 'Creating...' : 'Create'}</button>
                </div>
            </form>
            {error && <Image />}
        </>
    )
}
export default CreateTaskForm;