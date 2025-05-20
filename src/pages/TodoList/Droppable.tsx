import {useDroppable} from "@dnd-kit/core";
import {FC, ReactNode} from "react";

interface DroppableProps {
    id: number;
    children: ReactNode;
}

const Droppable: FC<DroppableProps> = (props) => {
    const {isOver, setNodeRef} = useDroppable({
        id: props.id,
    });
    const style = {
        color: isOver ? 'green' : undefined,
    };


    return (
        <div ref={setNodeRef} style={style}>
            {props.children}
        </div>
    );
};

export default Droppable;