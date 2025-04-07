import {Controller, useForm} from "react-hook-form";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";
import {ITaskResponse} from "./types.ts";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';

const CreateTaskForm = () => {



    const queryClient = useQueryClient();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<ITaskResponse>();

    const createTaskMutation = useMutation({
        mutationFn: (newTask: ITaskResponse) => {
            //если не undefined
            const formattedDate = newTask.dueTo ? format(newTask.dueTo, 'dd-MM-yyyy HH:mm') : null;
            return api.post("/task/api/v1/task", {
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
        }
    });

    const onSubmit = (data: ITaskResponse) => {
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
                {errors.title && <div>title is wrong</div>}
                <input
                    {...register("description")}
                    //type="password"
                    placeholder="Описание"
                />
                {errors.description && <div>description is wrong</div>}
                <select
                    {...register('status')}
                    defaultValue="NEW"
                    // aria-invalid={!!errors.category}
                >
                    <option value="NEW">Новое</option>
                    <option value="IN_PROGRESS">В работе</option>
                    <option value="COMPLETE">Выполнено</option>
                </select>
                {errors.status && <div>status is wrong</div>}
                <select
                    {...register('priority')}
                    defaultValue="DEFAULT"
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
                    // defaultValue={user?.id || ""}
                    placeholder="ID кому назначено"
                />
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
        </>
    )
}
export default CreateTaskForm;