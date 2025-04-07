// export interface ITaskRequest {
//     taskId: number,
//     title: string
//     description: string
//     status: "NEW" | "IN_PROGRESS" | "COMPLETE",
//     priority: "DEFAULT" | "LOW" | "MEDIUM" | "HIGH",
//     assignedToUserId: number
//     dueTo: Date
// }

export interface ITaskResponse {
    taskId: number,
    createdByUserId: number,
    assignedToUserId: number,
    title: string,
    description: string,
    dueTo: Date,
    status: "NEW" | "IN_PROGRESS" | "COMPLETE",
    priority: "DEFAULT" | "LOW" | "MEDIUM" | "HIGH",
    createdDate: string
}

