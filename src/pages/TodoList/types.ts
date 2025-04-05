export interface ICreatedTask {
    taskId: number,
    createdByUserId: number,
    assignedToUserId: number,
    title: string,
    description: string,
    dueTo: string,
    status: "NEW" | "IN_PROGRESS" | "COMPLETE",
    priority: "DEFAULT" | "LOW" | "MEDIUM" | "HIGH",
    comments: [
        {
            commentId: number,
            createdByUserId: number,
            parentTaskId: number,
            content: string,
            createdDate: string
        }
    ],
    createdDate: string
}