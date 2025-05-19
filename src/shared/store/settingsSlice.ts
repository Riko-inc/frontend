import {ISettings} from "../types.ts";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

const initialState: ISettings = {
    status: {
        NEW: "",
        IN_PROGRESS: "",
        COMPLETE: "",
    },
    priority: {
        DEFAULT: "",
        LOW: "",
        MEDIUM: "",
        HIGH: "",
    },
    users: {},
};

const settingsSlice = createSlice({
    name: 'settings',
    initialState,
    reducers: {
        setSettings(state, action: PayloadAction<ISettings>) {
            state.status = action.payload.status;
            state.priority = action.payload.priority;
            state.users = action.payload.users;
        },
        resetSettings: () => initialState,
    },
});

export const { setSettings, resetSettings } = settingsSlice.actions
export default settingsSlice.reducer;