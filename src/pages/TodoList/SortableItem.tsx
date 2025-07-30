import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {FC, ReactNode} from "react";
import {ITaskResponse} from "../../shared/types.ts";

interface SortableItemProps {
    id: number;
    index: number;
    children: ReactNode;
    isDragging?: boolean;
    isLast: boolean;
    prevTask: ITaskResponse | null;
    nextTask: ITaskResponse | null;
    prevTaskArray: ITaskResponse[];
    nextTaskArray: ITaskResponse[];
}

const SortableItem: FC<SortableItemProps> = (props) => {

    const {attributes, listeners, setNodeRef, transform, transition, isDragging} = useSortable({
        id: props.id,
        data: {
            index: props.index,
            isLast: props.isLast
        }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.children}
        </div>
    );
};

export default SortableItem;