import { Collapsible } from "radix-ui";


const FilterBar = () => {
    return (
        <>
            <Collapsible.Root>
                <Collapsible.Trigger>Показать/Скрыть</Collapsible.Trigger>
                <Collapsible.Content>
                    <p>Это содержимое будет показано или скрыто при нажатии на триггер.</p>
                </Collapsible.Content>
            </Collapsible.Root>
        </>
    );
};

export default FilterBar;