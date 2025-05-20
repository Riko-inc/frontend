import {useSortable} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {FC, ReactNode} from "react";

interface SortableItemProps {
    id: number;
    children: ReactNode;
}

const SortableItem: FC<SortableItemProps> = (props) => {

    const {attributes, listeners, setNodeRef, transform, transition} = useSortable({id: props.id});

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            {props.children}
        </div>
    );
};

export default SortableItem;