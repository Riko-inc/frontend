import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import {api} from "../../app/provider/AuthProvider.tsx";

const CreateTaskForm = () => {

    interface ITask {
        title: string;
        description: string;
        status: "NEW" | "IN_PROGRESS" | "COMPLETE";
        priority: "DEFAULT" | "LOW" | "MEDIUM" | "HIGH";
    }

    const {
        register,
        handleSubmit,
        formState: {errors},
        reset,
    } = useForm<ITask>();

    const createTaskMutation = useMutation({
        mutationFn: (newTask: ITask) =>
            api.post("/task/api/v1/task", newTask),
        onSuccess: (data) => {
            console.log("чел, задача создалась", data)
            reset()
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const onSubmit = (data: ITask) => {
        console.log("createTaskMutation");
        createTaskMutation.mutate(data)
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
                    {...register("description", {
                        required: "error",
                    })}
                    //type="password"
                    placeholder="Описание"
                />
                {errors.description && <div>description is wrong</div>}
                <select
                    {...register('status', {
                        required: 'error'
                    })}
                    defaultValue="NEW"
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
                    defaultValue="DEFAULT"
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
                        disabled={createTaskMutation.isPending}
                        type="submit"
                    >{createTaskMutation.isPending ? 'Creating...' : 'Create'}</button>
                </div>
            </form>
        </>
    )
}
export default CreateTaskForm;