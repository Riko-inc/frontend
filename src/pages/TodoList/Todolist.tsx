import {useNavigate} from "react-router-dom";
import CreateTaskForm from "./CreateTaskForm.tsx";
import {ROUTES} from "../../app/routes/Routes.tsx";
import TaskList from "./TaskList.tsx";


const Todolist = () => {


    const navigate = useNavigate();


    return (
        <>
            <div>TodoList</div>
            <button onClick={() => navigate(ROUTES.MAIN)}>Вернуться на главную страницу</button>

            <CreateTaskForm />

            <TaskList />
        </>
    )
}

export default Todolist;