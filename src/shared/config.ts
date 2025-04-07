const testUrl: string = "http://82.202.138.236:31064"
export const API_URL: string = testUrl;
// + "/auth/api/v1";

const authService: string = "/auth/api/v1/auth"
const taskService: string = "/task/api/v1"


export const API_ENDPOINTS = {
    //auth-service
    LOGIN: authService + "/authenticate",
    SIGNUP: authService + "/register",
    REFRESH: authService + "refresh",
    //task-service
    GET_TASKS: taskService + "/tasks",
    CREATE_TASK: taskService + "/task",
    EDIT_TASK: taskService + "/task",
    DELETE_TASK: taskService + "/task",
}
