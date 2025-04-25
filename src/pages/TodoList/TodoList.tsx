import {useNavigate} from "react-router-dom";
import CreateTaskForm from "./CreateTaskForm.tsx";
import {ROUTES} from "../../app/routes/Routes.tsx";
import TaskList from "./TaskList.tsx";
import Navbar from "../../widgets/navbar/Navbar.tsx";
import { Button, TextField } from "@radix-ui/themes";


const TodoList = () => {


    const navigate = useNavigate();



    return (
        <>
            <Navbar />



            <TextField.Root placeholder="Search the docs…">
                <TextField.Slot>

                </TextField.Slot>
            </TextField.Root>

            <input
                type="text"
                id="firstName"
                defaultValue="Pedro Duarte"
            />


            <div>TodoList</div>
            <button onClick={() => navigate(ROUTES.MAIN)}>Вернуться на главную страницу</button>

            <CreateTaskForm />
            <p>--------------------------------------------------------------------</p>
            <TaskList />
        </>
    )
}

export default TodoList;