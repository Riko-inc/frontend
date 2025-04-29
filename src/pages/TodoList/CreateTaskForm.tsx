import {useState} from "react";
import TaskDialog from "./TaskDialog.tsx";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ITaskRequest} from "../../shared/types.ts";
import {format} from "date-fns";
import {api} from "../../app/contexts/AuthContext.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";

const CreateTaskForm = () => {
    const [open, setOpen] = useState(false);
    const queryClient = useQueryClient();

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
            setOpen(false);
        },
        onError: (error) => {
            console.error(error);
        }
    });

    return (
        <div onClick={() => setOpen(true)}>
            <TaskDialog open={open}
                        onOpenChange={() => setOpen(false)}
                        taskMutationFunction={createTaskMutation.mutate}
                        triggerText="Создать задачу"
                        title="Создать задачу"
                        description="Заполните поля для новой задачи"
            />
        </div>
    );
};

export default CreateTaskForm;