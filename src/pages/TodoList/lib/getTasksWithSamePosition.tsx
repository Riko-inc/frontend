import {ITaskResponse} from "../../../shared/types.ts";

const GetTasksWithSamePosition = (tasks: ITaskResponse[], currentIndex: number) => {
    const currentTask = tasks[currentIndex];
    if (!currentTask) return { prevTaskArray: [], nextTaskArray: [] };

    const prevTaskArray: ITaskResponse[] = [];
    const nextTaskArray: ITaskResponse[] = [];

    const indPrev = currentIndex - 1
    const indNext = currentIndex + 1
    const taskPos = tasks[currentIndex].position;

    if (tasks[indPrev]) {
        let count = 0;
        while (tasks[indPrev - count].position === taskPos) {
            if (indPrev - count === 0) {
                break;
            }
            prevTaskArray.unshift(tasks[indPrev - count]);
            count++;
        }
        prevTaskArray.unshift(tasks[indPrev - count]);
    }

    if (tasks[indNext]) {
        let count = 0;
        while (tasks[indNext + count].position === taskPos) {
            if (indNext + count === tasks.length - 1) {
                break;
            }
            nextTaskArray.unshift(tasks[indNext + count]);
            count++;
        }
        nextTaskArray.unshift(tasks[indNext + count]);
    }



    return { prevTaskArray, nextTaskArray }
};

export default GetTasksWithSamePosition;