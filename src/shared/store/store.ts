import {combineReducers, configureStore} from "@reduxjs/toolkit";
import filterReducer from "./filterSlice.ts"

const rootReducer = combineReducers({
    filters: filterReducer,
})

export const setupStore = () => {
    return configureStore({
        reducer: rootReducer,
    })
}

export type RootState = ReturnType<typeof rootReducer>
export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']