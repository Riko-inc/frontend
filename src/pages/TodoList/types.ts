export interface ITaskRequest {
    title: string
    description: string
    status: TStatus,
    priority: TPriority,
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
    status: TStatus,
    priority: TPriority,
    createdDate: string
}

export type TStatus = "NEW" | "IN_PROGRESS" | "COMPLETE"
export type TPriority = "DEFAULT" | "LOW" | "MEDIUM" | "HIGH"


