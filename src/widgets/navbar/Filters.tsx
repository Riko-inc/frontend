import {
    Disclosure, DisclosureButton, DisclosurePanel,
    Popover,
    PopoverButton,
    PopoverPanel
} from "@headlessui/react";
import {useUsers} from "../../pages/TodoList/lib.ts";
import {createUseStyles} from "react-jss";
import {ITheme} from "../../shared/styles/themes.ts";
import {flexCenter} from "../../shared/styles/mixins.ts";
import Checkbox from "../../shared/ui/Checkbox.tsx";
import {FieldValues, FormProvider, useForm} from "react-hook-form";
import {useAppDispatch, } from "../../shared/store/redux.ts";
import {setFilters} from "../../shared/store/filterSlice.ts";
import {useEffect} from "react";
import {IFilterValues} from "../../shared/types.ts";



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

        height: 'auto',
        maxHeight: 'min(400px, 50vh)',
        minHeight: '200px',
        overflowY: 'auto',

        overscrollBehavior: 'contain',
        position: 'relative',

        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',


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

        backgroundColor: theme.colors.background,
        "&:hover": {
            backgroundColor: theme.colors.neutral,

        },
    },
    itemPanel: {
        width: "100%",
    },
    item: {

    }
}));

const deafultFilterValues: IFilterValues = {
    status: [],
    priority: [],
    assignedToUserId: [],
    createdByUserId: []
}

const Filters = () => {
    const classes = useStyles();
    const {data: users} = useUsers()
    const methods = useForm({
        defaultValues: deafultFilterValues
    });

    const dispatch = useAppDispatch();

    const { watch } = methods;
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
        <Popover>
            <PopoverButton className={classes.filterButton}>Фильтры</PopoverButton>
            <FormProvider {...methods}>
                <PopoverPanel anchor="bottom end" className={classes.container}>
                    {Object.entries(filtersData).map(([filterKey, options]) => (
                        <Disclosure key={filterKey} defaultOpen={true} as="div" className={classes.itemPanel}>
                            {({ open }) => (
                                <>
                                    <DisclosureButton className={classes.itemButton}>
                                        <span>{filterKey}</span>
                                    </DisclosureButton>
                                    <DisclosurePanel className={classes.itemPanel}>
                                        {Object.entries(options).map(([optionKey, optionLabel]) => (
                                            <div key={optionKey} className={classes.item}>
                                                <Checkbox value={optionKey} label={optionLabel} name={filterKey} />
                                            </div>
                                        ))}
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                    ))}
                    {usersLists.map((title) => (
                        <Disclosure defaultOpen={true} key={title} as="div">
                            {({ open }) => (
                                <>
                                    <DisclosureButton className={classes.itemButton}>
                                        <span>{title}</span>
                                    </DisclosureButton>
                                    <DisclosurePanel className={classes.itemPanel}>
                                        {users && users.map((user) => (
                                            <div key={user.id} className={classes.item}>
                                                <Checkbox value={`${user.id}`}
                                                          label={`Пользователь с id ${user.id}`}
                                                          name={title}/>
                                            </div>
                                        ))}
                                    </DisclosurePanel>
                                </>
                            )}
                        </Disclosure>
                    ))}
                </PopoverPanel>
            </FormProvider>
        </Popover>
    );
};

export default Filters;