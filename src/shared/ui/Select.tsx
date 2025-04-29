import * as RadixSelect from "@radix-ui/react-select";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { createUseStyles } from "react-jss";
import {flexCenter} from "../styles/mixins.ts";
import {ITheme} from "../styles/themes.ts";
import {FC} from "react";
import {CheckIcon} from "@radix-ui/react-icons";
import {useController, useFormContext} from "react-hook-form";

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
        "&:focus": {
            outline: `1px solid ${theme.colors.neutral}`,
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
        // boxShadow: `0 0 5px ${theme.colors.neutral}`,
        minWidth: '200px',
    },
    Viewport: {
        padding: theme.spacing.sm,
        width: '100%',
    },
    Scroll: {
        maxHeight: '200px',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            display: 'none',
        }
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
        "&:focus": {
            outline: 'none',
        },
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
    values: Record<string, string>;
    setIsUserActionTrue?: () => void
}

const Select: FC<SelectProps> = ({name, values, setIsUserActionTrue}) => {
    const classes = useStyles();
    const { control } = useFormContext();

    const {
        field: { onChange, value },
    } = useController({ name, control, defaultValue: "" });

    const handleChange = (value: string) => {
        if (setIsUserActionTrue) {
            setIsUserActionTrue()
        }
        onChange(value)
    }

    return (
        <RadixSelect.Root value={value || ""} onValueChange={handleChange}>

            <RadixSelect.Trigger className={classes.Trigger}>
                <RadixSelect.Value placeholder="Placeholder" />
                <RadixSelect.Icon className={classes.Icon}>
                    <ChevronDownIcon />
                </RadixSelect.Icon>
            </RadixSelect.Trigger>

            <RadixSelect.Portal >
                <RadixSelect.Content onClick={(e) => e.stopPropagation()}
                                     className={classes.Content}
                                     position="popper" side="bottom" align="end" sideOffset={5}>
                    <RadixSelect.Viewport className={classes.Viewport}>
                        <RadixSelect.Group>
                            <RadixSelect.Label className={classes.Label}>{name}</RadixSelect.Label>

                            <div className={classes.Scroll}>
                                {Object.entries(values).map(([optionValue, optionLabel]) => (
                                    <div key={optionValue}>
                                        <RadixSelect.Item className={classes.Item} value={optionValue}>
                                            <RadixSelect.ItemText>{optionLabel}</RadixSelect.ItemText>
                                            <RadixSelect.ItemIndicator className={classes.ItemIndicator}>
                                                <CheckIcon />
                                            </RadixSelect.ItemIndicator>
                                        </RadixSelect.Item>
                                    </div>
                                ))}
                            </div>

                        </RadixSelect.Group>
                    </RadixSelect.Viewport>
                </RadixSelect.Content>
            </RadixSelect.Portal>
        </RadixSelect.Root>
    );
};

export default Select;
