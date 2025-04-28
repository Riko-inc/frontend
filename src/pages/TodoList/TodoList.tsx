import TaskList from "./TaskList.tsx";
import Navbar from "../../widgets/navbar/Navbar.tsx";
import CreateTaskForm from "./CreateTaskForm.tsx";


const TodoList = () => {

    return (
        <>
            <Navbar />
            <CreateTaskForm />
            <TaskList />
        </>
    )
}

export default TodoList;