const API_URL: string = "http://82.202.138.236:31064";

const authService: string = API_URL + "/auth/api/v1"
const taskService: string = API_URL + "/task/api/v1"


export const API_ENDPOINTS = {
    //auth-service
    LOGIN: authService + "/auth/authenticate",
    SIGNUP: authService + "/auth/register",
    REFRESH: authService + "/auth/refresh-token",
    USERS: authService + "/user",
    //task-service
    GET_TASKS: taskService + "/tasks",
    CREATE_TASK: taskService + "/task",
    EDIT_TASK: taskService + "/task",
    DELETE_TASK: taskService + "/task",
}
