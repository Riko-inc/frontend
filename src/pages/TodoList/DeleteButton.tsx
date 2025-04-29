import {useMutation, useQueryClient} from "@tanstack/react-query";
import {api} from "../../app/contexts/AuthContext.tsx";
import {API_ENDPOINTS} from "../../shared/config.ts";
import {FC} from "react";
import Button from "../../shared/ui/Button.tsx";
import {createUseStyles} from "react-jss";

const useStyles = createUseStyles({
    button: {
        backgroundColor: 'red',
        "&:hover": {
            backgroundColor: 'darkred',
        },
    }
});

interface DeleteButtonProps {
    taskId: number;
    onClose?: () => void;
}

const DeleteButton: FC<DeleteButtonProps> = ({taskId, onClose}) => {
    const queryClient = useQueryClient();
    const classes = useStyles()

    const deleteTaskMutation = useMutation({
        mutationFn: () =>
            api.delete(`${API_ENDPOINTS.DELETE_TASK}/${taskId}`),
        onSuccess: () => {
            console.log("задача удалена")
            queryClient.invalidateQueries({ queryKey: ['tasks'] })
            if (onClose) {
                onClose();
            }
        },
        onError: (error) => {
            console.error(error);
        }
    });

    const deleteTask = () => {
        deleteTaskMutation.mutate()
    }

    return (
        <>
            <Button fontSize="16px" onClick={deleteTask}
                    type="button"
                    className={classes.button}>Удалить</Button>
        </>
    );
};

export default DeleteButton;