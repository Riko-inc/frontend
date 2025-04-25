import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { createUseStyles } from "react-jss";
import {flexCenter} from "../../shared/styles/mixins.ts";
import {ITheme} from "../../shared/styles/themes.ts";
import {FC} from "react";
import {CheckIcon} from "@radix-ui/react-icons";

const useStyles = createUseStyles((theme: ITheme) => ({
    Trigger: {
        fontSize: theme.typography.fontSize.small,
        backgroundColor: theme.colors.background,
        border: `1px solid ${theme.colors.neutral}`,
        borderRadius: "8px",
        padding: theme.spacing.xs,
        margin: theme.spacing.xs,
        ...flexCenter("row"),
        gap: '2px',

        "&:hover": {
            backgroundColor: theme.colors.neutral,
        },
    },
    Icon: {
        color: theme.colors.text,
        ...flexCenter("column")
    },
    Content: {
        ...flexCenter("column"),
        border: `1px solid ${theme.colors.neutral}`,
        backgroundColor: theme.colors.background,
        borderRadius: "8px",
        boxShadow: `0 0 5px ${theme.colors.neutral}`,
        minWidth: '200px',
    },
    Viewport: {
        padding: theme.spacing.sm,
        width: '100%',
    },
    Item: {
        position: "relative",
        ...flexCenter("row"),
        fontSize: theme.typography.fontSize.small,
        gap: '3px',
        width: '100%',
        display: "flex",
        justifyContent: "space-between",
        borderRadius: "6px",
        "&:hover": {
            backgroundColor: theme.colors.neutral,
        },
        padding: theme.spacing.xs,
    },
    Label: {
        color: theme.colors.neutral,
        padding: theme.spacing.xs,
        fontSize: theme.typography.fontSize.small,
    },
    ItemIndicator: {
        width: 25,
        ...flexCenter("column")
    },
}));

interface SelectProps {
    name: string;
    currentValue: string;
    values: Record<string, string>;
}

const Select: FC<SelectProps> = ({name, currentValue, values}) => {
    const classes = useStyles();

    return (
        <RadixSelect.Root defaultValue={currentValue}>

            <RadixSelect.Trigger className={classes.Trigger}>
                <RadixSelect.Value placeholder="placeholder" />
                <RadixSelect.Icon className={classes.Icon}>
                    <ChevronDownIcon />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal>
                <RadixSelect.Content className={classes.Content} position="popper" side="bottom" align="end" sideOffset={5}>
                    <RadixSelect.Viewport className={classes.Viewport}>
                        <RadixSelect.Group>
                            <RadixSelect.Label className={classes.Label}>{name}</RadixSelect.Label>

                            {Object.entries(values).map(([valueKey, valueLabel]) => (
                                <div key={valueKey}>
                                    <RadixSelect.Item className={classes.Item} value={valueKey}>
                                        <RadixSelect.ItemText>{valueLabel}</RadixSelect.ItemText>
                                        <RadixSelect.ItemIndicator className={classes.ItemIndicator}>
                                            <CheckIcon />
                                        </RadixSelect.ItemIndicator>
                                    </RadixSelect.Item>
                                </div>
                            ))}
                        </RadixSelect.Group>
                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
};

export default Select;
