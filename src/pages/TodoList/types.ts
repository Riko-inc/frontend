export interface ITaskRequest {
    title: string
    description: string
    status: "NEW" | "IN_PROGRESS" | "COMPLETE",
    priority: "DEFAULT" | "LOW" | "MEDIUM" | "HIGH",
    assignedToUserId: string
    dueTo: Date | null
}

export interface ITaskResponse {
    taskId: number,
    createdByUserId: number,
    assignedToUserId: string,
    title: string,
    description: string,
    dueTo: Date,
    status: "NEW" | "IN_PROGRESS" | "COMPLETE",
    priority: "DEFAULT" | "LOW" | "MEDIUM" | "HIGH",
    createdDate: string
}

