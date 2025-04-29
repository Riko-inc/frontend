import { Collapsible, Popover} from "radix-ui";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import {flexCenter} from "../../shared/styles/mixins.ts";

import {FormProvider, useForm} from "react-hook-form";
import {useAppDispatch} from "../../shared/store/redux.ts";
import {IFilterValues} from "../../shared/types.ts";
import {useEffect} from "react";
import {setFilters} from "../../shared/store/filterSlice.ts";
import {useUsers} from "../../pages/TodoList/lib.ts";
import Checkbox from "../../shared/ui/Checkbox.tsx";

const useStyles = createUseStyles((theme: ITheme) => ({
    filterButton: {
        fontSize: theme.typography.fontSize.medium,
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.neutral}`,
        borderRadius: "8px",
        padding: theme.spacing.xs,
        margin: theme.spacing.xs,

        "&:hover": {
            backgroundColor: theme.colors.neutral,
        },
    },
    container: {
        ...flexCenter("column"),
        border: `1px solid ${theme.colors.neutral}`,
        backgroundColor: theme.colors.background,
        borderRadius: "8px",
        boxShadow: `0 0 5px ${theme.colors.neutral}`,

        padding: theme.spacing.sm,
        margin: theme.spacing.xs,
        minWidth: '230px',

        paddingRight: '5px',

        "&:focus": {
            outline: 'none',
        },
    },
    itemButton: {
        borderRadius: "6px",
        border: "none",
        fontSize: theme.typography.fontSize.medium,
        width: "100%",
        padding: '4px',
        // margin: `${theme.spacing.xs} 0`,

        justifyContent: "start",
        color: theme.colors.neutral,
        backgroundColor: theme.colors.background,
        "&:hover": {
            backgroundColor: theme.colors.neutral,
            color: theme.colors.background,
        },
    },
    itemPanel: {
        width: "100%",
    },
    item: {
        ...flexCenter("row"),
        gap: '3px',
        width: '100%',
        display: "flex",
        justifyContent: "start",
        borderRadius: "6px",
        padding: `2px 5px`,
        "&:hover": {
            backgroundColor: theme.colors.neutral,
        },
    },
    ScrollRoot: {
        width: '100%',
        maxHeight: '400px',
        borderRadius: '6px',
        overflowY: "auto",
        '&::-webkit-scrollbar': {
            display: 'none',
        },

        backgroundColor: theme.colors.background,
    },
}));

const deafultFilterValues: IFilterValues = {
    status: [],
    priority: [],
    assignedToUserId: [],
    createdByUserId: []
}

const FilterBar = () => {
    const classes = useStyles();
    const {data: users} = useUsers()
    const filterForm = useForm({
        defaultValues: deafultFilterValues
    });

    const dispatch = useAppDispatch();

    const { watch } = filterForm;
    const formValues: IFilterValues = watch();

    useEffect(() => {
        dispatch(setFilters(formValues));
    }, [formValues, dispatch]);

    const usersLists = ["assignedToUserId", "createdByUserId"]
    const filtersData = {
        status: {
            NEW: "Новые",
            IN_PROGRESS: "В работе",
            COMPLETE: "Выполненные",
        },
        priority: {
            DEFAULT: "Обычный",
            LOW: "Низкий",
            MEDIUM: "Средний",
            HIGH: "Высокий",
        }
    }

    return (
        <FormProvider {...filterForm}>
            <Popover.Root>
                <Popover.Trigger asChild>
                    <button className={classes.filterButton}>Фильтры</button>
                </Popover.Trigger>
                <Popover.Portal>
                    <Popover.Content className={classes.container}>
                        <div className={classes.ScrollRoot}>
                            {Object.entries(filtersData).map(([filterKey, options]) => (
                                <Collapsible.Root key={filterKey} className={classes.itemPanel} defaultOpen={true}>
                                    <Collapsible.Trigger className={classes.itemButton}>{filterKey}</Collapsible.Trigger>
                                    <Collapsible.Content className={classes.itemPanel}>
                                        {Object.entries(options).map(([optionKey, optionLabel]) => (
                                            <div key={optionKey} className={classes.item}>
                                                <Checkbox value={optionKey} label={optionLabel} name={filterKey} />
                                            </div>
                                        ))}
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            ))}
                            {usersLists.map((title) => (
                                <Collapsible.Root key={title} className={classes.itemPanel} defaultOpen={true}>
                                    <Collapsible.Trigger className={classes.itemButton}>{title}</Collapsible.Trigger>
                                    <Collapsible.Content className={classes.itemPanel}>
                                        {users && users.map((user) => (
                                            <div key={user.id} className={classes.item}>
                                                <Checkbox value={`${user.id}`} label={`Пользователь с id ${user.id}`} name={title} />
                                            </div>
                                        ))}
                                    </Collapsible.Content>
                                </Collapsible.Root>
                            ))}
                        </div>
                    </Popover.Content>
                </Popover.Portal>
            </Popover.Root>
        </FormProvider>
    );
};

export default FilterBar;