export interface ITaskRequest {
    title: string
    description: string
    status: TStatus,
    priority: TPriority,
    assignedToUserId: string
    dueTo: Date | null
}

export interface ITaskResponse extends ITaskRequest {
    taskId: number,
    position: number,
    createdByUserId: number,
    dueTo: Date,
    createdDate: string
}

export type TStatus = "NEW" | "IN_PROGRESS" | "COMPLETE"
export type TPriority = "DEFAULT" | "LOW" | "MEDIUM" | "HIGH"

export interface IFilterValues {
    status: TStatus[],
    priority: TPriority[],
    assignedToUserId: string[],
    createdByUserId: string[],
}

export interface IUserServerData {
    email: string,
    id: number,
    role: string,
    registrationDateTime: string,
}

export interface ISettings {
    status: Record<TStatus, string>,
    priority: Record<TPriority, string>,
    users: Record<string, string>,
}


