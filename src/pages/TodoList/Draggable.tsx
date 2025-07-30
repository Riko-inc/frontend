import {useDraggable} from "@dnd-kit/core";
import {FC, ReactNode} from "react";

interface DraggableProps {
    id: number;
    children: ReactNode;
}

const Draggable: FC<DraggableProps> = (props) => {
    const {attributes, listeners, setNodeRef} = useDraggable({
        id: props.id,
    });



    return (
        <div ref={setNodeRef} {...listeners} {...attributes}>
            {props.children}
        </div>
    );
};

export default Draggable;