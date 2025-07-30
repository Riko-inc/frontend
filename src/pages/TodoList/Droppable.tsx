import {useDroppable} from "@dnd-kit/core";
import {FC, ReactNode} from "react";

interface DroppableProps {
    id: string;
    children: ReactNode;
}

const Droppable: FC<DroppableProps> = (props) => {
    const {setNodeRef} = useDroppable({
        id: props.id,
    });



    return (
        <div ref={setNodeRef}>
            {props.children}
        </div>
    );
};

export default Droppable;