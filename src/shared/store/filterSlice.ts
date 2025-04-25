import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IFilterValues} from "../types.ts";


const initialState: IFilterValues = {
    status: [],
    priority: [],
    assignedToUserId: [],
    createdByUserId: []
}

const filtersSlice = createSlice({
    name: 'filters',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<IFilterValues>) {
            state.status = action.payload.status;
            state.priority = action.payload.priority;
            state.assignedToUserId = action.payload.assignedToUserId;
            state.createdByUserId = action.payload.createdByUserId;
        },
        resetFilters: () => initialState,
    },
});

export const { setFilters, resetFilters } = filtersSlice.actions
export default filtersSlice.reducer;